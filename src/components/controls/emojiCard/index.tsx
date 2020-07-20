import React from 'react';
import Popover from 'react-tiny-popover';
import emojis from './emoji';

const EmojiCard = (Props: { handler: any }) => {
  // Popover state
  const [emojiPopoverStatus, setEmojiPopoverStatus] = React.useState<boolean>(
    false
  );
  const emojiContent = () => {
    return (
      <div className="nexment-emoji-container">
        {emojis.map(cate => {
          return (
            <div>
              <h5>{cate[0]}</h5>
              {cate.slice(1).map(item => {
                return <p
                  onClick={() => {
                    Props.handler(item);
                  }}
                >
                  {item}
                </p>;
              })}
            </div>
          );
        })}
      </div>
    );
  };
  return (
    <Popover
      isOpen={emojiPopoverStatus}
      position={'top'}
      content={emojiContent}
      onClickOutside={() => {
        setEmojiPopoverStatus(false);
      }}
    >
      <button onClick={() => setEmojiPopoverStatus(true)}>emoji</button>
    </Popover>
  );
};

export default EmojiCard;
