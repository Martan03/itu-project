/**
 * ITU project
 *
 * Tomáš Daniel <xdanie14>
 */

import React, { useState } from 'react';
import { ReactComponent as TrashIcon } from '../icons/trash.svg';
import { TitleInput, DescInput } from "../components/Input";
import { DateRange } from "../components/DateRange";
import '../css/BottomModal.css';
import { getVacation, saveVacation, deleteVacation } from '../Db';

const BottomModal = ({id, setId, setEvents}) => {
  const [data, setData] = useState(null);

  useState(() => {
    // TODO: handle errors and loading
    getVacation(id, setData, () => {}, () => {});
  }, [id])

  const closeModal = () => {
    setId(null);
  };

  const closeOnOutsideClick = (event) => {
    if (event.target === event.currentTarget) {
      closeModal();
    }
  };

  const inputChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const saveData = () => {
    setEvents(prev => {
      return prev.map(item => {
        if (item.id === id) {
          return {
            id: data.id,
            title: data.title ?? 'No title',
            start: new Date(Date.parse(data.start_date)),
            end: new Date(Date.parse(data.end_date)),
          }
        }
        return item;
      });
    })
    saveVacation(data);
  };

  const removeTrip = () => {
    setEvents((prev) => {
      return prev.filter((item) => item.id !== id);
    });
    deleteVacation(id);
    closeModal();
  };

  return (
    <div className='modal'>
      {data ? (
        <div onClick={closeOnOutsideClick} style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Modal content */}
            <div className="modal-content">
              <div className="modal-header">
                <span className="close" onClick={closeModal}>✔</span>
                <DateRange input
                  values={[data.start_date, data.end_date]}
                  onChange={inputChange}
                  onBlur={saveData}
                />
                <TitleInput
                  onChange={inputChange}
                  onBlur={saveData}
                  value={data.title}
                />
              </div>
              <div className="modal-body">
                <div className='vacation-header'>
                <DescInput
                  onChange={inputChange}
                  onBlur={saveData}
                  value={data.description}
                />
                </div>
              </div>
              <div className="modal-footer">
                  <button
                      onClick={removeTrip}
                      className="remove-trip-button">
                      <TrashIcon/>
                  </button>
              </div>
            </div>
          </div>
      ) : ''}
    </div>
  );
};

export default BottomModal;
