import { useEffect, useState } from "react";
import "./App.css";
import Navbar from "../components/Navbar/Navbar";
import Board from "../components/Board/Board";
// import data from '../data'
import { DragDropContext } from "react-beautiful-dnd";
import { v4 as uuidv4 } from "uuid";
import Editable from "../components/Editable/Editable";
import useLocalStorage from "use-local-storage";
import "../bootstrap.css";
import LeaderBoard from "./Components/LeaderBoard/LeaderBoard";
import Wave from 'react-wavify'
import logo from './vulsquash2.png'
import axios from 'axios'

function App() {
  const [data, setData] = useState(
    localStorage.getItem("kanban-board")
      ? JSON.parse(localStorage.getItem("kanban-board"))
      : []
  );

  const defaultDark = window.matchMedia(
    "(prefers-colors-scheme: dark)"
  ).matches;
  const [theme, setTheme] = useLocalStorage(
    "theme",
    "dark"
  );

  const setName = (title, bid) => {
    const index = data.findIndex((item) => item.id === bid);
    const tempData = [...data];
    tempData[index].boardName = title;
    setData(tempData);
  };

  const dragCardInBoard = (source, destination) => {
    let tempData = [...data];
    const destinationBoardIdx = tempData.findIndex(
      (item) => item.id.toString() === destination.droppableId
    );
    const sourceBoardIdx = tempData.findIndex(
      (item) => item.id.toString() === source.droppableId
    );
    tempData[destinationBoardIdx].card.splice(
      destination.index,
      0,
      tempData[sourceBoardIdx].card[source.index]
    );
    tempData[sourceBoardIdx].card.splice(source.index, 1);

    return tempData;
  };

  const addCard = (title, bid) => {
    const index = data.findIndex((item) => item.id === bid);
    const tempData = [...data];
    tempData[index].card.push({
      id: uuidv4(),
      title: title,
      tags: [],
      task: [],
    });
    setData(tempData);
  };

  const [commitHash, setCommitHash] = useState('');

  const addFullCard = (title, tags, task, desc, assignee, bid) => {
    // bid is boardId
    const index = data.findIndex((item) => item.id === bid);
    const tempData = [...data];
    tempData[index].card.push({
      id: uuidv4(),
      title: title,
      tags: tags,
      task: task,
      desc: desc,
      assignee: assignee,
    });
    setData(tempData);
  }

  useEffect(() => {
    const getCommitHashes = async() => {
        try {
        const response = await axios.get(`http://127.0.0.1:8000/get_commits`);
        const { hashes } = response.data;

        // if there is no board yet, make a board
        const boardId = 0;
        // add cards to board with title = commit hash
        hashes.forEach(hash => {
          addCard(
            hash, // title
            boardId
          )
        })
      } catch (error) {
        console.error('Error fetching commit hashes:', error);
      }
    }
  }, []);

  useEffect(() => {
    const fetchIssues = async (commitHash) => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/commits/${commitHash}`);
        const { issues } = response.data;

        for (const issueId in issues) {
          const deps = issues[issueId];
          deps.forEach(dep => {
            addFullCard(
              dep.name + " | Severity: " + String(dep.severity), // title
              [],       // tags (adjust if there are tags in the data)
              issueId,  // task (using issueId as task)
              dep.description, // add date
              '',       // assignee (adjust if there is an assignee in the data)
              dep.bid   // bid 
            );
          });
        }
      } catch (error) {
        console.error('Error fetching issues:', error);
      }
    };

    // Call fetchIssues with the desired commit hash
    fetchIssues(commitHash);
  }, [commitHash]);

  const removeCard = (boardId, cardId) => {
    const index = data.findIndex((item) => item.id === boardId);
    const tempData = [...data];
    const cardIndex = data[index].card.findIndex((item) => item.id === cardId);

    tempData[index].card.splice(cardIndex, 1);
    setData(tempData);
  };

  const addBoard = (title) => {
    const tempData = [...data];
    tempData.push({
      id: uuidv4(),
      boardName: title,
      card: [],
    });
    setData(tempData);
  };

  const removeBoard = async (commitHash, bid) => {
    try {
      const response = await axios.delete(`http://127.0.0.1:8000/boards/${commitHash}/${bid}`);
      console.log(response.data.message);

      const tempData = [...data];
      const index = data.findIndex((item) => item.id === bid);
      tempData.splice(index, 1);
      setData(tempData);
    } catch (error) {
      console.error("Error removing board:", error);
    }
  };

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    if (source.droppableId === destination.droppableId) return;

    setData(dragCardInBoard(source, destination));
  };

  const updateCard = (bid, cid, card) => {
    const index = data.findIndex((item) => item.id === bid);
    if (index < 0) return;

    const tempBoards = [...data];
    const cards = tempBoards[index].card;

    const cardIndex = cards.findIndex((item) => item.id === cid);
    if (cardIndex < 0) return;

    tempBoards[index].card[cardIndex] = card;
    console.log(tempBoards);
    setData(tempBoards);
  };

  useEffect(() => {
    localStorage.setItem("kanban-board", JSON.stringify(data));
  }, [data]);

  return (
    <div>
    <div style={{ backgroundColor: '#212121', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    <Wave mask="url(#mask)" fill="#ADD8E6" >
        <defs>
          <linearGradient id="gradient" gradientTransform="rotate(90)">
            <stop offset="0" stopColor="white" />
            <stop offset="0.5" stopColor="black" />
          </linearGradient>
          <mask id="mask">
            <rect x="0" y="0" width="2000" height="300" fill="url(#gradient)" />
          </mask>
        </defs>
      </Wave>
    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: '150px', marginTop: '50px' }}>
        <img  className="name" src={logo} style={{ width: '800px', height: '500px' }} />
      </div>
    <Wave mask="url(#mask)" fill="#212121" >
        <defs>
          <linearGradient id="gradient" gradientTransform="rotate(90)">
            <stop offset="0" stopColor="black" />
            <stop offset="0.5" stopColor="white" />
          </linearGradient>
          <mask id="mask">
            <rect x="0" y="0" width="2000" height="300" fill="url(#gradient)" />
          </mask>
        </defs>
      </Wave>
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="App" data-theme={theme}>
        <div className="app_outer">
          <div className="app_boards">
            {data.map((item) => (
              <Board
                key={item.id}
                id={item.id}
                name={item.boardName}
                card={item.card}
                setName={setName}
                addCard={addCard}
                removeCard={removeCard}
                removeBoard={removeBoard}
                updateCard={updateCard}
              />
            ))}
            <Editable
              class={"add__board"}
              name={"Add Board"}
              btnName={"Add Board"}
              onSubmit={addBoard}
              placeholder={"Enter Board  Title"}
            />
          </div>
        </div>
      </div>
    </DragDropContext>
    </div>
    <LeaderBoard/>
    </div>
  );
}

export default App;
