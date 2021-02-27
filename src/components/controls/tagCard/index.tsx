import React from 'react';
import { Popover } from 'react-tiny-popover';
import Icons from '../../icons/index';
import translate, { getBestLanguage } from '../../../lib/translation/index';

const TagCard = (Props: { tag: string; handler: any }) => {
  // Translation
  const Translation = translate.use().text;

  // Popover state
  const [tagPopoverStatus, setTagPopoverStatus] = React.useState<boolean>(
    false
  );

  /**
   * Tag popover content
   *
   * @returns
   */
  const tagContent = () => {
    return (
      <div className="nexment-popover">
        <div className="nexment-popover-text">
          <b>{Translation.desTag}</b>
        </div>
        <p>{Translation.desTagDes}</p>
        <div className="nexment-popover-input">
          <input
            placeholder={Props.tag ? Props.tag : Translation.desTag}
            onChange={Props.handler}
          ></input>
          <button
            className={getBestLanguage() === 'zh' ? 'nexment-tag-button' : ''}
            onClick={() => {
              setTagPopoverStatus(!tagPopoverStatus);
            }}
          >
            {Translation.confirm}
          </button>
        </div>
      </div>
    );
  };
  return (
    <Popover
      isOpen={tagPopoverStatus}
      positions={['top', 'bottom', 'left', 'right']}
      content={tagContent}
      onClickOutside={() => {
        setTagPopoverStatus(!tagPopoverStatus);
      }}
    >
      <button onClick={() => setTagPopoverStatus(!tagPopoverStatus)}>
        {Props.tag ? Icons().tagFill : Icons().tag}
      </button>
    </Popover>
  );
};

export default TagCard;
