import React, { useState, useEffect } from 'react';


import Help from '../images/help.svg'

import { ReactComponent as HelpIcon } from '../images/help.svg';
import { ReactComponent as FeedbackIcon } from '../images/Feedback.svg';
import { ReactComponent as PasteIcon } from '../images/Paste.svg';
import ReasoningSideBar from './ReasoningSideBar';

import { ThreeDots } from 'react-loader-spinner'

const ChatMessages = ({ text, isUser, isLoading, help, isFetching, themeColors }) => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isToggleOpen, setToggleOpen] = useState(false);

  const userData = JSON.parse(localStorage.getItem('userData'));






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
    <div className='w-full '>
      <div className={messageStyle}>
        {/* green profile puc to represent the message from the model */}
        {!isUser && <div className="flex-none w-[40px] h-[40px] bg-green-500 rounded-full ml-2 mt-2 text-center">A</div>}
        {/* Message content and fetching animation*/}
        <div className={`p-4 pb-2 max-w-[750px] ${themeColors.chatbg} ${themeColors.txt} rounded-lg`}>
          <div className={`mb-2 ${isUser ? "text-secondary" : "text-green-500"}`}>
            {isUser ? `User:` : `Acharya:`}
          </div>
          {/* fetching animation  */}
          {isFetching && <ThreeDots
            height="20"
            width="30"
            color={`${themeColors.color}`} />}
          {formattedText}
          {!isUser && (isLoading === false) &&
            <div className='mt-5 flex items-center justify-end gap-1'>
              <button>
                <PasteIcon className={`h-[20px] ${themeColors.reasonIcon}`} />
              </button>
              <button>
                <FeedbackIcon className={`h-[20px] ${themeColors.reasonIcon}`} />
              </button>
            </div>

          }
        </div>
        {/* displaying the reasoning button only if the messages not from user  */}
        {!isUser && (isLoading === false) &&
          <div className="flex flex-col justify-end flex-shrink-0">
            <button className={`reasoning ${themeColors.chatbg} p-2 rounded-lg`} onClick={() => setToggleOpen(!isToggleOpen)}>
              {/* <img src={Help} alt='reasoning ' className='h-[20px] text-black' /> */}
              <HelpIcon className={`h-[20px] ${themeColors.reasonIcon}`} />
            </button>
          </div>}
        {/* User profile pic or purple profile pic to represent the message from user */}
        {isUser && (userData && userData.profilePic) ? (
          <img src={userData.profilePic} referrerpolicy="no-referrer" alt="Profile Pic" className="flex-none h-[40px] rounded-full mr-2" />
        ) : (
          <div className="flex-none h-100 bg-secondary rounded-full mr-2"></div>
        )}

      </div>
      <ReasoningSideBar isToggleOpen={isToggleOpen} handleCloseToggle={() => setToggleOpen(!isToggleOpen)} reasoningArray={uniqueReasoningArray} themeColors={themeColors} />
    </div>
  );
};

export default ChatMessages;
