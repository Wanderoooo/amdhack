import React, { useState, useEffect } from "react";
import {
  Calendar,
  Camera,
  Check,
  CheckSquare,
  Clock,
  CreditCard,
  List,
  PenTool,
  Plus,
  Tag,
  Trash,
  Type,
  X,
} from "react-feather";
import { Select } from 'antd';
import Editable from "../../Editable/Editable";
import Modal from "../../Modal/Modal";
import "./CardDetails.css";
import { v4 as uuidv4 } from "uuid";
import Label from "../../Label/Label";
import Description from "../../Description/Description";
import logo from '../../../src/Images/html.png'

export default function CardDetails(props) {
  const options = [{label: 'lucy', value: 'Lucy'}, {label: 'John Doe', value: 'John Doe'}, {label: 'Jane Doe', value: 'Jane Doe'}]
  const colors = ["#61bd4f", "#f2d600", "#ff9f1a", "#eb5a46", "#c377e0"];
  const [values, setValues] = useState({ ...props.card });
  const [input, setInput] = useState(false);
  const [text, setText] = useState(values.title);
  const [labelShow, setLabelShow] = useState(false);
  const [descShow, setDescShow] = useState(false);
  const onChange = (value) => {
    setValues({...values, owner: {...values.owner, name: value}})
  };
  const filterOption = (input, option) =>
    (option?.label ?? '').toLowerCase().includes(input.toLowerCase());
  const Input = (props) => {
    return (
      <div className="">
        <input
          autoFocus
          defaultValue={text}
          type={"text"}
          onChange={(e) => {
            setText(e.target.value);
          }}
        />
      </div>
    );
  };
  const addTask = (value) => {
    values.task.push({
      id: uuidv4(),
      task: value,
      completed: false,
      points: 2,
    });
    setValues({ ...values });
  };

  const removeTask = (id) => {
    const remaningTask = values.task.filter((item) => item.id !== id);
    setValues({ ...values, task: remaningTask });
  };

  const deleteAllTask = () => {
    setValues({
      ...values,
      task: [],
    });
  };

  const updateTask = (id) => {
    const taskIndex = values.task.findIndex((item) => item.id === id);
    values.task[taskIndex].completed = !values.task[taskIndex].completed;
    console.log("values.owner", values.owner)
    const updateLeaderboard = {...props.leaderboard}
    if (values.owner.name !== 'Unassigned' && values.task[taskIndex].completed) {
      if (updateLeaderboard[values.owner.name]) {
        updateLeaderboard[values.owner.name] = updateLeaderboard[values.owner.name] + values.task[taskIndex].points;
      } else {
        updateLeaderboard[values.owner.name] = values.task[taskIndex].points;
      }
      const entries = Object.entries(updateLeaderboard);
      const sortedEntries = entries.sort((a, b) => b[1] - a[1]);
      const sortedObj = Object.fromEntries(sortedEntries);

      console.log("sortedObj", sortedObj)
      props.setLeaderboard(sortedObj)
    }
    setValues({ ...values });
  };
  const updateTitle = (value) => {
    setValues({ ...values, title: value });
  };

  const calculatePercent = () => {
    const totalTask = values.task.length;
    const completedTask = values.task.filter(
      (item) => item.completed === true
    ).length;

    return Math.floor((completedTask * 100) / totalTask) || 0;
  };

  const removeTag = (id) => {
    const tempTag = values.tags.filter((item) => item.id !== id);
    setValues({
      ...values,
      tags: tempTag,
    });
  };

  
  const addDesc = (desc) => {
    setValues({ ...values, desc: desc });
  };

  const addTag = (value, color) => {
    values.tags.push({
      id: uuidv4(),
      tagName: value,
      color: color,
    });

    setValues({ ...values });
  };

  const handelClickListner = (e) => {
    if (e.code === "Enter") {
      setInput(false);
      updateTitle(text === "" ? values.title : text);
    } else return;
  };

  useEffect(() => {
    document.addEventListener("keypress", handelClickListner);
    return () => {
      document.removeEventListener("keypress", handelClickListner);
    };
  });
  useEffect(() => {
    if (props.updateCard) props.updateCard(props.bid, values.id, values);
  }, [values]);

  return (
    <Modal onClose={props.onClose}>
      <div className="local__bootstrap">
        <div
          className="container"
          style={{ minWidth: "650px", position: "relative" }}
        >
          <div className="row pb-4">
            <div className="col-12">
              <div className="d-flex align-items-center pt-3 gap-2">
                <CreditCard className="icon__md" />
                {input ? (
                  <Input title={values.title} />
                ) : (
                  <h5
                    style={{ cursor: "pointer" }}
                    onClick={() => setInput(true)}
                  >
                    {values.title}
                  </h5>
                )}
              </div>
            </div>
          </div>
          <div>
          {logo &&
          <div style={{display: 'flex', flexDirection: 'row'}}>
              <img src={logo} style={{height: '22px', marginRight: '22px'}} title={props.owner?.name ?? 'Unassigned'}/>
<p>{props.card.owner?.name}</p>
</div>}
</div>
          <div className="row">
            <div className="col-8">
              <h6 className="text-justify">Label</h6>
              <div
                className="d-flex label__color flex-wrap"
                style={{ width: "500px", paddingRight: "10px" }}
              >
                {values.tags.length !== 0 ? (
                  values.tags.map((item) => (
                    <span
                      className="d-flex justify-content-between align-items-center gap-2"
                      style={{ backgroundColor: item.color, marginBottom: "10px"}}
                    >
                      {item.tagName.length > 10
                        ? item.tagName.slice(0, 6) + "..."
                        : item.tagName}
                      <X
                        onClick={() => removeTag(item.id)}
                        style={{ width: "15px", height: "15px" }}
                      />
                    </span>
                  ))
                ) : (
                  <span
                    style={{ color: "#ccc" }}
                    className="d-flex justify-content-between align-items-center gap-2"
                  >
                    <i> No Labels</i>
                  </span>
                )}
              </div>
              <div className="row">
              <div className="col-8">
                  <h6 className="text-justify">Description</h6>
                  <div
                className="d-flex label__color flex-wrap"
                style={{ width: "500px", paddingRight: "10px" }}
              >
                  <p>{props.card.desc ?? <i style={{marginLeft: '12px'}}>No Description</i>}</p>
                </div>
                </div>
                </div>
              <div className="check__list mt-2">
                <div className="d-flex align-items-end  justify-content-between">
                  <div className="d-flex align-items-center gap-2">
                    <CheckSquare className="icon__md" />
                    <h6>Check List</h6>
                  </div>
                  <div className="card__action__btn">
                    <button onClick={() => deleteAllTask()}>
                      Delete all tasks
                    </button>
                  </div>
                </div>
                <div className="progress__bar mt-2 mb-2">
                  <div className="progress flex-1">
                    <div
                      class="progress-bar"
                      role="progressbar"
                      style={{ width: calculatePercent() + "%" }}
                      aria-valuenow="75"
                      aria-valuemin="0"
                      aria-valuemax="100"
                    >
                      {calculatePercent() + "%"}
                    </div>
                  </div>
                </div>

                <div className="my-2">
                  {values.task.length !== 0 ? (
                    values.task.map((item, index) => (
                      <div className="task__list d-flex align-items-start gap-2">
                        <input
                          className="task__checkbox"
                          type="checkbox"
                          defaultChecked={item.completed}
                          onChange={() => {
                            updateTask(item.id);
                          }}
                        />

                        <h6
                          className={`flex-grow-1 ${
                            item.completed === true ? "strike-through" : ""
                          }`}
                        >
                          {item.task}
                        </h6>
                        <Trash
                          onClick={() => {
                            removeTask(item.id);
                          }}
                          style={{
                            cursor: "pointer",
                            widht: "18px",
                            height: "18px",
                          }}
                        />
                      </div>
                    ))
                  ) : (
                    <></>
                  )}

                  <Editable
                    parentClass={"task__editable"}
                    name={"Add Task"}
                    btnName={"Add task"}
                    onSubmit={addTask}
                  />
                </div>
              </div>
            </div>
            <div className="col-4">
              <h6>Add to card</h6>
              <div className="d-flex card__action__btn flex-column gap-2">
              <Select
                showSearch
                placeholder="Select an assignee"
                optionFilterProp="children"
                onChange={onChange}
                filterOption={filterOption}
                options={options}
                defaultValue={values.owner.name}
              />
                <button onClick={() => {
                  setLabelShow(!labelShow)
                  setDescShow(false)}}>
                  <span className="icon__sm">
                    <Tag />
                  </span>
                  Add Label
                </button>
                {labelShow && (
                  <Label
                    color={colors}
                    addTag={addTag}
                    tags={values.tags}
                    onClose={setLabelShow}
                  />
                )}
                <button onClick={() => {setDescShow(!descShow)
                  setLabelShow(false)}}>
                  <span className="icon__sm">
                    <PenTool />
                  </span>
                  Add Description
                </button>
                {descShow && (
                  <Description
                    color={colors}
                    addDesc={addDesc}
                    tags={values.tags}
                    onClose={setLabelShow}
                  />
                )}

                <button onClick={() => props.removeCard(props.bid, values.id)}>
                  <span className="icon__sm">
                    <Trash />
                  </span>
                  Delete Card
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
