import useComments from '../../lib/database/getCommentsList';
import React from 'react';
import Modal from '../modal';
import CommentsArea from '../../components/sections/CommentsArea';

const CommentsList = (Props: { type: string; pageKey: string }) => {
  // Reusable data list
  const { commentsData, isLoading, isError } = useComments(Props.pageKey);

  // Modal states
  const [modalVisibility, setModalVisibility] = React.useState<{
    [propsName: string]: boolean;
  }>({});

  // Comment state
  const [replyToID, setReplyToID] = React.useState<number>();
  const [replyToOID, setReplyToOID] = React.useState<string>();
  const [commentsAreaRandom, setRandom] = React.useState<number>(Math.random());

  /**
   * Modal toggling function
   *
   * @param {commentsItemType[]} replies
   * @param {string} replyTo
   */
  const toggleModal = (repliesBelongOID: string) => {
    setModalVisibility((prevState: any) => {
      const nowState = { ...prevState };
      nowState[repliesBelongOID] = nowState[repliesBelongOID] ? false : true;
      return nowState;
    });
  };

  if (isLoading) {
    return <div>Loading....</div>;
  } else if (isError) {
    return <div>Error.</div>;
  } else {
    console.log(commentsData);
    return (
      <div>
        <CommentsArea
          pageKey={Props.pageKey}
          replyTo={replyToID}
          replyToOID={replyToOID}
          primaryReplyTo={undefined}
          primaryReplyToOID={undefined}
          random={commentsAreaRandom}
        />
        <ul>
          {commentsData !== undefined && commentsData.length ? (
            commentsData.map(item => (
              <li key={item.ID}>
                <div>
                  <h5>{item.name}</h5>
                  <p>
                    {item.content}
                    <button
                      onClick={() => {
                        setReplyToID(item.ID);
                        setReplyToOID(item.OID);
                        setRandom(Math.random());
                      }}
                    >
                      reply
                    </button>
                  </p>
                </div>
                <div>
                  <ul>
                    {item.replyList.map(replyItem => (
                      <li key={replyItem.ID}>
                        <div>
                          <h5>{replyItem.name}</h5>
                          <p>
                            @{item.name}: {replyItem.content}
                            <button
                              onClick={() => {
                                setReplyToID(replyItem.ID);
                                setReplyToOID(replyItem.OID);
                                setRandom(Math.random());
                              }}
                            >
                              reply
                            </button>
                            {replyItem.hasReplies ? (
                              <button
                                onClick={() => {
                                  toggleModal(replyItem.OID);
                                }}
                              >
                                view
                              </button>
                            ) : (
                              ''
                            )}
                          </p>
                        </div>
                        <div>
                          {replyItem.hasReplies &&
                          modalVisibility[replyItem.OID] ? (
                            <Modal
                              key={replyItem.OID}
                              type="repliesList"
                              content={replyItem.replyList}
                              replyTo={replyItem.name}
                              replyToID={replyItem.ID}
                              replyToOID={replyItem.OID}
                              pageKey={Props.pageKey}
                              visibilityFunction={toggleModal}
                              replyItem={replyItem}
                            />
                          ) : (
                            ''
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
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
  }
};

export default CommentsList;
