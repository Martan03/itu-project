import React, { useState } from 'react';
import { ReactComponent as TrashIcon } from '../icons/trash.svg';
import { TitleInput, DescInput } from "../components/Input";
import { DateRange } from "../components/DateRange";
import '../css/BottomModal.css';

const BottomModal = ({start_date, end_date}) => {
  const [modalVisible, setModalVisible] = useState(false);

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const closeOnOutsideClick = (event) => {
    if (event.target === event.currentTarget) {
      closeModal();
    }
  };

  const inputChange = (e) => {
    // TODO
  };

  const saveData = () => {
    // TODO
  };

  return (
    <div>
      {modalVisible && (
      <div onClick={closeOnOutsideClick} style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Modal content */}
          <div className="modal-content">
            <div className="modal-header">
              <span className="close" onClick={closeModal}>&times;</span>
              <DateRange input
                values={[start_date, end_date]}
              />
              <TitleInput
                onChange={inputChange}
                onBlur={saveData}
                value={"Vacation"}
              />
            </div>
            <div className="modal-body">
              <div className='vacation-header'>
              <DescInput
                onChange={inputChange}
                onBlur={saveData}
                value={"Pokus"}
              />
              </div>
            </div>
            <div className="modal-footer">
                <button
                    //onClick={removeTrip}
                    className="remove-trip-button">
                    <TrashIcon/>
                </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BottomModal;
