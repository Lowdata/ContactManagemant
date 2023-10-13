import { useEffect, useState } from 'react';
import { Contact } from '../Contact';

function Contacts() {
  const [data, setData] = useState<Contact[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('http://localhost:7000/data'); // Use the API route
        if (response.ok) {
          const result = await response.json();
          setData(result);
        } else {
          console.error('Error fetching data');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchData();
  }, []);

  return (
    <div>
      <h1>Contact List</h1>
      <table style={{ border: '1px solid black', borderCollapse: 'collapse' }}>
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
            <td style={{ border: '1px solid black', padding: '8px' }}>{contact.index+1}</td>
            <td style={{ border: '1px solid black', padding: '8px' }}>{contact.name}</td>
            <td style={{ border: '1px solid black', padding: '8px' }}>{contact.email}</td>
            <td style={{ border: '1px solid black', padding: '8px' }}>{JSON.stringify(contact.createdAt)}</td>
          </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Contacts;
