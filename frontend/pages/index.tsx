import { useState, useEffect } from 'react';
import { Contact } from '../Contact';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { writeContract } from '@wagmi/core'
import { Info } from '../Info';
 

function formatContactDate(date: Date): string {
  return date.toLocaleString(); // You can use other date formatting methods if needed
}

const tableContainerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  paddingTop: '10px',
  height: '300px', // Set a fixed height
  overflow: 'auto',
};

const tableStyle: React.CSSProperties = {
  border: '1px solid black',
  borderCollapse: 'collapse',
  width: '100%',
};

const tableButtonsStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '8px',
};

const tableHeaderStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  width: '100%',
};
const modalBackgroundStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', /* Semi-transparent black background */
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000, /* Adjust the z-index as needed */
  };
  
  const modalStyle: React.CSSProperties = {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
    maxWidth: '80%', /* Adjust the width as needed */
    zIndex: 1001, /* Make sure it's above the background */
  };

function Contacts() {
  const [data, setData] = useState<Contact[]>([]);
  
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  function handlePopupSubmit() {
    const name = nameInput;
    const email = emailInput;
    contractfunction(name, email);
  
    setIsPopupVisible(false);
  }
  
  function handlePopupClose() {
    setIsPopupVisible(false);
  }
  async function contractfunction(name:string, email:string){
    const { hash } = await writeContract({
    address: '0xf89599EEDB2079008c3028D061222Bd58af1CE90',
    abi:Info.contractABI,
    functionName: 'addContact',
    args: [name, email],
  })}
  useEffect(() => {
    fetch('http://localhost:7000/data/') 
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setData(data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []); 

  

  return (
    <div style={tableContainerStyle}>
      <div style={tableHeaderStyle}>
        <div style={tableButtonsStyle}>
        <ConnectButton/>
        </div>
        <div style={tableButtonsStyle}>
        <button onClick={() => setIsPopupVisible(true)}>Add Contacts</button>
        </div>
      </div>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={{ border: '1px solid black', padding: '8px' }}>Index</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>Name</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>Email</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>Date</th>
          </tr>
        </thead>
        <tbody>
          {data.map((contact, index) => (
            <tr key={index}>
              <td style={{ border: '1px solid black', padding: '8px' }}>{contact.index}</td>
              <td style={{ border: '1px solid black', padding: '8px' }}>{contact.name}</td>
              <td style= {{ border: '1px solid black', padding: '8px' }}>{contact.email}</td>
              <td style={{ border: '1px solid black', padding: '8px' }}>{formatContactDate(contact.createdAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {isPopupVisible && (
        <div  style= {modalBackgroundStyle}>
          <div style={modalStyle}>
            <h2>Enter Name and Email</h2>
            <input
              type="text"
              placeholder="Name"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
            />
            <input
              type="text"
              placeholder="Email"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
            />
            <div>
              <button onClick={handlePopupSubmit}>Submit</button>
              <button onClick={handlePopupClose}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Contacts;
