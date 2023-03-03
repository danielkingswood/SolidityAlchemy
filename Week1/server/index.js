const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "04ba62efbde96ef98cf7ec8940b98b8cc74c4d66a9f3624e4f7af1733cf95a6a5cb4f937b97f4548ed0310b49925bc0a8cdf77c3c5111583785764c7a1c88c99ad": 100,
  "043075f295e9bbc65872e098f1662918a54a68eaeb4693eeb820201bb0bfa2aaf70aefe58db8cf30fbfcedb103a0925446d8f956dea574d372049ebf19c5579080": 50,
  "04982efb00ea2686dceee7e8c38031f602e4b9e428a15a033cca9e38cf47f27429fa4a3173ba66933ae75ec2f634bf1e0e3d7fde4cb5e41fb6673cb654300c18c5": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { sender, recipient, amount } = req.body;

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
