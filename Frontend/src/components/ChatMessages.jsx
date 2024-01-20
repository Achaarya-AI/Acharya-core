import React, { useState, useEffect } from 'react';


import Help from '../images/help.svg'
import ReasoningSideBar from './ReasoningSideBar';

import { ThreeDots } from 'react-loader-spinner'

const ChatMessages = ({ text, isUser, isLoading, help, isFetching }) => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isToggleOpen, setToggleOpen] = useState(false);



  const messageStyle = isUser
    ? 'flex gap-3 justify-end  text-left'
    : 'flex  gap-3 justify-start text-left ';

  // Adding br in chatmessages 
  const formattedText = text.split('\n').map((line, index) => (
    <React.Fragment key={index}>
      {index > 0 && <br />} {/* Add <br> after the first line */}
      {line}
    </React.Fragment>
  ));

  let uniqueReasoningArray = [];

  // Toggle sidebar when user clicks on help icon and filtering the duplicates
  if (isUser === false && isLoading === false) {
    const removeDuplicates = (arr, prop) => {
      const uniqueObjects = arr?.reduce((uniqueArr, obj) => {
        const isDuplicate = uniqueArr.some(item => item[prop] === obj[prop]);
        if (!isDuplicate) {
          uniqueArr.push(obj);
        }
        return uniqueArr;
      }, []);
      return uniqueObjects;
    };

    // Remove duplicates based on 'page_content' property
    if (help) {
      uniqueReasoningArray = removeDuplicates(help, 'page_content');
      console.log(uniqueReasoningArray);
      console.log(help);
    }
  }

  return (
    <div className='w-full'>
      <div className={messageStyle}>
        {!isUser && <div className="flex-none w-[5px] h-100 bg-green-500 rounded-full ml-2 "></div>}
        <div className='p-4 max-w-[750px] bg-[#2525259c] text-white rounded-lg'>
          <div className={`mb-2 ${isUser ? "text-secondary" : "text-green-500"}`}>
            {isUser ? `User:` : `Tutor:`}
          </div>
          {isFetching && <ThreeDots
            height="20"
            width="30"
            color="white" />}
          {formattedText}
        </div>
        {/* displaying the reasoning button  */}
        {!isUser && (isLoading === false) &&
          <div className="flex flex-col justify-end flex-shrink-0">
            <button className='reasoning bg-[#2525259c] p-2 rounded-lg' onClick={() => setToggleOpen(!isToggleOpen)}>
              <img src={Help} alt='reasoning ' className='h-[20px]' />
            </button>
          </div>}
        {isUser && <div className="flex-none w-[5px] h-100 bg-secondary rounded-full mr-2"></div>}
      </div>
      <ReasoningSideBar isToggleOpen={isToggleOpen} handleCloseToggle={() => setToggleOpen(!isToggleOpen)} reasoningArray={uniqueReasoningArray} />
    </div>
  );
};

export default ChatMessages;
