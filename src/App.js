import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}

function App() {
  const [toggleButton, setToggleButton] = useState(false);
  const [friendList, setFreindList] = useState(initialFriends);
  const [selectedFriend, setSelectedFriend] = useState(null);

  function handleAddFriend(friend) {
    setFreindList((friends) => [...friends, friend]);
    setToggleButton(false);
  }

  function handleSelectFriend(friend) {
    setSelectedFriend((curr) => (curr?.id === friend?.id ? null : friend));
    setToggleButton(false);
  }
  function handleSplitBill(value) {
    setFreindList(
      friendList.map((fr) =>
        fr.id === selectedFriend.id
          ? { ...fr, balance: fr.balance + value }
          : fr
      )
    );
  }
  console.log(selectedFriend);
  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList
          friendList={friendList}
          onSelection={handleSelectFriend}
          selectedFriend={selectedFriend}
        />

        {toggleButton && <FormAddFreind onAddFriend={handleAddFriend} />}

        <Button
          onClick={() => {
            setToggleButton(!toggleButton);
          }}
        >
          {!toggleButton ? "Add Freind" : "Close"}
        </Button>
      </div>
      {selectedFriend && (
        <FormSpliBill
          selectedFriend={selectedFriend}
          onSplitBill={handleSplitBill}
        />
      )}
    </div>
  );
}

function FriendsList({ friendList, onSelection, selectedFriend }) {
  // console.log(selectedFriend .id);
  return (
    <ul>
      {friendList.map((friend) => (
        <Freind
          friend={friend}
          key={friend.id}
          onSelection={onSelection}
          selectedFriend={selectedFriend}
        />
      ))}
    </ul>
  );
}

function Freind({ friend, onSelection, selectedFriend }) {
  console.log(friend.id);
  console.log(selectedFriend);

  const isSelected = selectedFriend?.id === friend.id;
  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>
      {friend.balance < 0 && (
        <p className="red">
          You Owe {friend.name} {Math.abs(friend.balance)}
        </p>
      )}
      {friend.balance > 0 && (
        <p className="green">
          {friend.name} Owes You {Math.abs(friend.balance)}
        </p>
      )}
      {friend.balance === 0 && <p>You Are {friend.name} are even</p>}
      <Button onClick={() => onSelection(friend)}>
        {isSelected ? "Close" : "Select"}
      </Button>
    </li>
  );
}

function FormAddFreind({ onAddFriend }) {
  const [name, setName] = useState("");
  const [img, setImg] = useState("https://i.pravatar.cc/48");

  function handleSubmit(e) {
    e.preventDefault();
    if (!name || !img) return;
    const id = crypto.randomUUID();
    const newFriend = {
      id,
      name,
      img: `${img}?=${id}`,
      balance: 0,
    };
    onAddFriend(newFriend);
    setName("");
    setImg("https://i.pravatar.cc/48");
  }
  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label>👭 Freind Name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <label>📷 Image Url</label>
      <input type="text" value={img} onChange={(e) => setImg(e.target.value)} />
      <Button>Add</Button>
    </form>
  );
}

function FormSpliBill({ selectedFriend, onSplitBill }) {
  const [bill, setBill] = useState("");
  const [paidByYou, setPaidByYou] = useState("");
  let friendBill = bill - paidByYou;
  const [whoIsPaying, setWhoIsPaying] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!bill || !paidByYou) return;
    onSplitBill(whoIsPaying === "user" ? friendBill : -paidByYou);
  }
  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>Split A Bill With {selectedFriend.name}</h2>

      <label>💰 Bill value</label>
      <input
        type="text"
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
      />

      <label>👤 Your Expense</label>
      <input
        type="text"
        value={paidByYou}
        onChange={(e) =>
          setPaidByYou(Number(e.target.value)) > bill
            ? paidByYou
            : Number(e.target.value)
        }
      />

      <label>👭 {selectedFriend.name} expense</label>
      <input type="text" value={friendBill} disabled />

      <label>🤑 who will pay?</label>
      <select
        value={whoIsPaying}
        onChange={(e) => setWhoIsPaying(e.target.value)}
      >
        <option value="user">You</option>
        <option value="x">x</option>
      </select>
      <Button>Split Bill</Button>
    </form>
  );
}

export default App;
