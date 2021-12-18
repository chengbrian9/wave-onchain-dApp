import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import './App.css';
import abi from './utils/wavePortals.json';

export default function App() {   
  const [currentAccount, setAccount] = useState("")
  const contractAddress = "0x0B2DCbC0a503AD3399556D4c4D766573da86CDd2"
  const contractABI = abi.abi

  const checkIfWalletConnected = async () => {
    try {
      const {ethereum} = window;
      if (!ethereum) {
        console.log('Make sure you have MetaMask!');
        return;
      } else {
        console.log('We have the Ethereum object.', ethereum);
      }
      const accounts = await ethereum.request({method: 'eth_accounts'});

      if (accounts.length === 0) {
        const account = accounts[0]
        console.log('Found an authorized account ', account)
      } else {
        console.log('No authorized account found')
      }
    } catch(error) {
      console.log(error);
    }
  }

  const connectWallet = async () => {
    try {
      const {ethereum} = window;
      if (!ethereum) {
        alert("get Metamask foo!")
        return;
      } 
    const accounts = await ethereum.request({method: 'eth_requestAccounts'});
    console.log("Successfully connected Metamask wallet ", accounts[0]);
    setAccount(accounts[0]);
  } catch (error) {
      console.log(error);
    }     
  }

  useEffect(() => {
    checkIfWalletConnected();
  }, [])
  
  const wave = async () => {
    try {
      const {ethereum} = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        let count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());
        const waveTxn = await wavePortalContract.wave();
        console.log("Mining...", waveTxn.hash);

        await waveTxn.wait();
        count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
  }
  
  return (
    <div className="mainContainer">

      <div className="dataContainer">
        <div className="header">
        👋 Hey there!
        </div>

        <div className="bio">
        I am brian and I am a defi degen and full stack dev! Connect your Ethereum wallet and wave at me!
        </div>

        <button className="waveButton" onClick={wave}>
          Wave at Me
        </button>

        {!currentAccount && (
          <button className="waveButton" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}
      </div>
    </div>
  );
}