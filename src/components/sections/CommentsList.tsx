import useComments from '../../lib/database/getCommentsList';
import React from 'react';
import Modal from '../modal';
import CommentsArea from '../../components/sections/CommentsArea';
import { nexmentConfigType } from '../container/index';
import '../../assets/style/commentslist.scss';
import { format } from 'timeago.js';

const CommentsList = (Props: {
  type: string;
  pageKey: string;
  config: nexmentConfigType;
}) => {
  // Reusable data list
  const { commentsData, isLoading, isError } = useComments(
    Props.pageKey,
    Props.config
  );

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

  const adminBadge = (name: string, email: string) => {
    if (
      name === Props.config.admin.name &&
      email === Props.config.admin.email
    ) {
      return <span className="nexment-admin-badge">Admin</span>;
    } else {
      return '';
    }
  };

  if (isLoading) {
    return <div>Loading....</div>;
  } else if (isError) {
    return <div>Error.</div>;
  } else {
    return (
      <div>
        <CommentsArea
          pageKey={Props.pageKey}
          replyTo={replyToID}
          replyToOID={replyToOID}
          primaryReplyTo={undefined}
          primaryReplyToOID={undefined}
          random={commentsAreaRandom}
          config={Props.config}
        />
        <ul>
          {commentsData !== undefined && commentsData.length ? (
            commentsData.map(item => (
              <li key={item.ID}>
                <div>
                  <h5>
                    {item.name} ({format(item.date)})({item.tag})
                    {adminBadge(item.name, item.email)}
                  </h5>
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
                          <h5>
                            {replyItem.name}({format(replyItem.date)})({replyItem.tag})
                            {adminBadge(replyItem.name, replyItem.email)}
                          </h5>
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
                              config={Props.config}
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
