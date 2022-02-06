import { ethers } from "ethers";

const provider = new ethers.providers.Web3Provider(window.ethereum);

async function getCurrentBlock() {
  let currentBlock = await provider.getBlockNumber();
  let previousBlock = currentBlock - 1;
  document.getElementById("previous-block-id").innerText = previousBlock;
  document.getElementById("current-block-id").innerText = currentBlock;

  getCurrentBlockDetails("previous", previousBlock);
  getCurrentBlockDetails("current", currentBlock);
}

async function getCurrentBlockDetails(section, blockId) {
  const block = await provider.getBlockWithTransactions(blockId);
  document.getElementById(`${section}-block-timestamp`).innerText =
    block.timestamp;
  document.getElementById(`${section}-block-minedby`).innerText = block.miner;
  document.getElementById(`${section}-block-difficulty`).innerText =
    block.difficulty;
  document.getElementById(`${section}-block-reward`).innerText = block.gasLimit
    .sub(block.gasUsed)
    .toString();
  document.getElementById(`${section}-block-gaslimit`).innerText =
    block.gasLimit;
  document.getElementById(`${section}-block-gasused`).innerText = block.gasUsed;
}

async function getLatestTransactions() {
  let html = "";

  const latestBlock = await provider.getBlockNumber();
  const block = await provider.getBlockWithTransactions(latestBlock);
  const transactions = block.transactions;

  for (let i = 0; i < transactions.length; i++) {
    html += `<ul>
      <li>Hash: <span id="transaction-hash">${transactions[i].hash}</span></li>
      <li>Status: <span id="transaction-status">${
        transactions[i].confirmations > 0 ? "Success" : "Processing"
      }</span></li>
      <li>Block: <span id="transaction-block">${
        transactions[i].blockNumber
      }</span></li>
      <li>Data: <span id="transaction-data">${transactions[i].data}</span></li>
      <li>From: <span id="transaction-from">${transactions[i].from}</span></li>
      <li>To: <span id="transaction-from">${transactions[i].to}</span></li>
      <li>Type: <span id="transaction-to">${transactions[i].type}</span></li>
    </ul>`;
  }

  document.getElementById("latest-transactions").innerHTML = html;
}

export async function dispatchModal(event) {
  const input = document.getElementById("search-input");
  console.log(input.value);
  if (input.value.length === 42) {
    getAccountDetails(input.value);
    toggleModal(event);
  } else if (input.value.length === 66) {
    getTransactionDetails(input.value);
    toggleModal(event);
  } else {
    console.log("Not an address nor a tx");
  }
}

async function getAccountDetails(address) {
  let html = `<h5>Details for wallet: ${address}</h5>`;
  const balance = await provider.getBalance(address);
  const transactionCount = await provider.getTransactionCount("ricmoo.eth");

  html += `<ul>`;
  html += `<li>Balance: <span id="balance">${ethers.utils.formatEther(
    balance
  )}</span></li>`;
  html += `<li>Transaction count: <span id="balance">${transactionCount}</span></li>`;
  html += `</ul>`;

  document.getElementById("search-results").innerHTML = html;
}

async function getTransactionDetails(address) {
  let html = `<h5>Details of transaction: ${address}</h5>`;
  const transaction = await provider.getTransaction(address);
  html += `<ul>
    <li>Hash: <span id="transaction-hash">${transaction.hash}</span></li>
    <li>Status: <span id="transaction-status">${
      transaction.confirmations > 0 ? "Success" : "Processing"
    }</span></li>
    <li>Block: <span id="transaction-block">${
      transaction.blockNumber
    }</span></li>
    <li>Data: <span id="transaction-data">${transaction.data}</span></li>
    <li>From: <span id="transaction-from">${transaction.from}</span></li>
    <li>To: <span id="transaction-from">${transaction.to}</span></li>
    <li>Type: <span id="transaction-to">${transaction.type}</span></li>
  </ul>`;

  document.getElementById("search-results").innerHTML = html;
}

document.addEventListener("DOMContentLoaded", function () {
  getCurrentBlock();
  getLatestTransactions();
});
