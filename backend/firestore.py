import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

# Use a service account.
cred = credentials.Certificate('C:\\Users\\winstang\\amdhack-58ad0-firebase-adminsdk-dpnss-89da1a3d8c.json')

app = firebase_admin.initialize_app(cred)

db = firestore.client()

def test(): 
    try: 
        doc_ref = db.collection("users").document("bzheng")
        doc_ref.set({"first": "Bowen", "last": "Zheng", "born": 20022020020202})

        users_ref = db.collection("users")
        docs = users_ref.stream()

        for doc in docs:
            print(f"{doc.id} => {doc.to_dict()}")

    except Exception as e:
        print(f"fhkjsdhfjsd")

if __name__ == "__main__":
    test()