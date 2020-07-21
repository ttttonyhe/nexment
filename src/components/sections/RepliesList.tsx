import React from 'react';
import '../../assets/style/reply.scss';
import { commentsItemType } from 'lib/database/getCommentsList';
import CommentsArea from '../../components/sections/CommentsArea';
import Rodal from 'rodal';
import 'rodal/lib/rodal.css';
import '../../assets/style/modal.scss';

const RepliesList = (Props: {
  dataContent: commentsItemType[];
  replyTo?: string;
  pageKey: string;
  replyToID?: number;
  replyToOID?: string;
  visibilityFunction?: Function;
  replyItem?: any;
}) => {
  // Modal states
  const [modalVisibility, setModalVisibility] = React.useState<{
    [propsName: string]: boolean;
  }>({});

  // Comment state
  const [replyToID, setReplyToID] = React.useState<number>(
    Props.replyToID ? Props.replyToID : 0
  );
  const [replyToOID, setReplyToOID] = React.useState<string>(
    Props.replyToOID ? Props.replyToOID : ''
  );
  const [commentsAreaRandom, setRandom] = React.useState<number>(Math.random());

  /**
   * Modal toggling function
   *
   * @param {string} repliesBelongOID
   */
  const toggleModal = (repliesBelongOID: string) => {
    /**
     * State updating solution
     * refer to https://blog.csdn.net/vandavidchou/article/details/102618866
     */
    setModalVisibility((prevState: any) => {
      const nowState = { ...prevState };
      nowState[repliesBelongOID] = nowState[repliesBelongOID] ? false : true;
      return nowState;
    });
  };

  // Modal closing event handler
  const handleClose = (OID: string) => {
    toggleModal(OID);
  };

  return (
    <div className="nexment-reply-container">
      <CommentsArea
        pageKey={Props.pageKey}
        replyTo={replyToID}
        replyToOID={replyToOID}
        primaryReplyTo={Props.replyToID}
        primaryReplyToOID={Props.replyToOID}
        random={commentsAreaRandom}
      />
      <ul>
        <li>
          <div>
            <h5>{Props.replyItem.name}</h5>
            <p>{Props.replyItem.content}</p>
          </div>
        </li>
        {Props.dataContent !== undefined && Props.dataContent.length ? (
          Props.dataContent.map(item => (
            <li key={item.ID}>
              <div>
                <h5>{item.name}</h5>
                <p>
                  @{Props.replyTo}: {item.content}
                  <button
                    onClick={() => {
                      setReplyToID(item.ID);
                      setReplyToOID(item.OID);
                      setRandom(Math.random());
                    }}
                  >
                    reply
                  </button>
                  {item.hasReplies ? (
                    <button
                      onClick={() => {
                        toggleModal(item.OID);
                      }}
                    >
                      view
                    </button>
                  ) : (
                    ''
                  )}
                </p>
              </div>
              {/* Replies */}
              <div>
                {// Recursive reply modal
                item.hasReplies && modalVisibility[item.OID] ? (
                  <Rodal
                    visible={modalVisibility[item.OID]}
                    onClose={() => {
                      handleClose(item.OID);
                    }}
                    animation="fade"
                  >
                    <RepliesList
                      key={item.OID}
                      dataContent={item.replyList}
                      replyTo={item.name}
                      pageKey={Props.pageKey}
                      replyToID={item.ID}
                      replyToOID={item.OID}
                      replyItem={item}
                    />
                  </Rodal>
                ) : (
                  ''
                )}
              </div>
            </li>
          ))
        ) : (
          <li>
            <p>No Comments</p>
          </li>
        )}
      </ul>
    </div>
  );
};
export default RepliesList;
