import useComments from '../../lib/database/getCommentsList';
import React from 'react';
import Modal from '../modal';
import CommentsArea from '../../components/sections/CommentsArea';
import { nexmentConfigType } from '../container/index';
import '../../assets/style/commentslist.scss';
import { format } from 'timeago.js';
const md5 = require('js-md5');
import Icons from '../icons/index';

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
      return <div className="nexment-admin-badge">{Icons().admin}</div>;
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
        <ul className="nexment-comments-list">
          {commentsData !== undefined && commentsData.length ? (
            commentsData.map(item => (
              <li className="nexment-comments-list-item" key={item.ID}>
                <div
                  className="nexment-comments-div"
                  onClick={() => {
                    setReplyToID(item.ID);
                    setReplyToOID(item.OID);
                    setRandom(Math.random());
                  }}
                >
                  <div className="nexment-comments-avatar">
                    <img
                      src={
                        'https://gravatar.loli.net/avatar/' + md5(item.email)
                      }
                    />
                    {adminBadge(item.name, item.email)}
                  </div>
                  <div className="nexment-comments-title">
                    <h5>
                      {item.name}
                      <span> · </span>
                      <b>{format(item.date)}</b>
                    </h5>
                    <p className="nexment-comments-des">{item.tag}</p>
                    <p
                      className={
                        'nexment-comments-content ' +
                        (item.tag ? '' : 'margin-top')
                      }
                    >
                      {item.content}
                      <em className="nexment-reply-icon">{Icons().reply}</em>
                    </p>
                  </div>
                </div>

                <div>
                  <ul className="nexment-comments-reply-list">
                    {item.replyList.map(replyItem => (
                      <div className="nexment-comments-list-item-div" key={replyItem.ID}>
                        <li
                          className="nexment-comments-list-item"
                          onClick={() => {
                            if (replyItem.hasReplies) {
                              toggleModal(replyItem.OID);
                            } else {
                              setReplyToID(replyItem.ID);
                              setReplyToOID(replyItem.OID);
                              setRandom(Math.random());
                            }
                          }}
                        >
                          <div className="nexment-comments-div">
                            <div className="nexment-comments-avatar">
                              <img
                                src={
                                  'https://gravatar.loli.net/avatar/' +
                                  md5(replyItem.email)
                                }
                              />
                              {adminBadge(replyItem.name, replyItem.email)}
                            </div>
                            <div className="nexment-comments-title">
                              <h5>
                                {replyItem.name}
                                <span> · </span>
                                <b>{format(replyItem.date)}</b>
                              </h5>
                              <p className="nexment-comments-content margin-top-reply">
                                <b className="nexment-comments-replyto">
                                  @{item.name}
                                </b>
                                {replyItem.content}
                                <em className="nexment-reply-icon-reply">
                                  {Icons().reply}
                                </em>
                              </p>
                            </div>
                          </div>
                        </li>
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
                      </div>
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
