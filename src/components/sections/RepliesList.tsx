import React from 'react';
import '../../assets/style/reply.scss';
import { commentsItemType } from 'lib/database/getCommentsList';
import CommentsArea from '../../components/sections/CommentsArea';
import Rodal from 'rodal';
import 'rodal/lib/rodal.css';
import '../../assets/style/modal.scss';
import { nexmentConfigType } from '../container/index';
import { format } from 'timeago.js';
const md5 = require('js-md5');
import Icons from '../icons/index';
import MarkdownView from 'react-showdown';
import ContentLoader from 'react-content-loader';

const RepliesList = (Props: {
  dataContent: commentsItemType[];
  replyTo?: string;
  pageKey: string;
  replyToID?: number;
  replyToOID?: string;
  replyToName?: string;
  visibilityFunction?: Function;
  replyItem?: any;
  config: nexmentConfigType;
}) => {
  // Modal states
  const [modalVisibility, setModalVisibility] = React.useState<{
    [propsName: string]: boolean;
  }>({});

  // Loading state
  const [loadingStatus, setLoadingStatus] = React.useState<boolean>(false);

  // Comment state
  const [replyToID, setReplyToID] = React.useState<number>(
    Props.replyToID ? Props.replyToID : 0
  );
  const [replyToOID, setReplyToOID] = React.useState<string>(
    Props.replyToOID ? Props.replyToOID : ''
  );
  const [replyToName, setReplyToName] = React.useState<string>(
    Props.replyToName ? Props.replyToName : ''
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

  return (
    <div>
      <div className="nexment-modal-text">
        <h1>Replies</h1>
        <p>@{Props.replyToName}</p>
      </div>
      <div className="nexment-reply-container">
        <CommentsArea
          pageKey={Props.pageKey}
          replyTo={replyToID}
          replyToOID={replyToOID}
          replyToName={replyToName}
          primaryReplyTo={Props.replyToID}
          primaryReplyToOID={Props.replyToOID}
          primaryReplyToName={Props.replyToName}
          random={commentsAreaRandom}
          config={Props.config}
          reloadFunc={setLoadingStatus}
        />
        <ul className="nexment-comments-list">
          <li
            className="nexment-comments-list-item"
            id={Props.replyItem.ID.toString()}
          >
            <div
              className="nexment-comments-div nexment-reply-primary"
              onClick={() => {
                setReplyToID(Props.replyItem.ID);
                setReplyToOID(Props.replyItem.OID);
                setReplyToName(Props.replyItem.name);
                setRandom(Math.random());
                window.location.href = '#nexment-comment-area';
              }}
            >
              <div className="nexment-comments-avatar">
                <img
                  src={
                    'https://gravatar.loli.net/avatar/' +
                    md5(Props.replyItem.email)
                  }
                />
                {adminBadge(Props.replyItem.name, Props.replyItem.email)}
              </div>
              <div className="nexment-comments-title">
                <h5>
                  {Props.replyItem.name}
                  <span> · </span>
                  <b>{format(Props.replyItem.date)}</b>
                  <em className="nexment-reply-icon">{Icons().reply}</em>
                </h5>
                <p className="nexment-comments-des">{Props.replyItem.tag}</p>
                <div
                  className={
                    'nexment-comments-content ' +
                    (Props.replyItem.tag ? '' : 'margin-top')
                  }
                >
                  <MarkdownView
                    markdown={Props.replyItem.content}
                    options={{ tables: true, emoji: true }}
                  />
                </div>
              </div>
            </div>
            <div>
              <ul className="nexment-comments-reply-list">
                {loadingStatus ? (
                  <div className="nexment-loading">
                    <ContentLoader
                      speed={2}
                      width={100}
                      style={{ width: '100%' }}
                      height={45}
                      backgroundColor="#f3f3f3"
                      foregroundColor="#ecebeb"
                    >
                      <rect
                        x="52"
                        y="8"
                        rx="3"
                        ry="3"
                        width="100%"
                        height="10"
                      />
                      <rect
                        x="52"
                        y="30"
                        rx="3"
                        ry="3"
                        width="80%"
                        height="10"
                      />
                      <circle cx="20" cy="24" r="20" />
                    </ContentLoader>
                  </div>
                ) : (
                  ''
                )}
                {Props.dataContent !== undefined && Props.dataContent.length ? (
                  Props.dataContent.map(item => (
                    <div
                      className="nexment-comments-list-item-div"
                      key={item.ID}
                      id={item.ID.toString()}
                    >
                      <li className="nexment-comments-list-item">
                        <div
                          className="nexment-comments-div"
                          onClick={() => {
                            if (item.hasReplies) {
                              toggleModal(item.OID);
                            } else {
                              setReplyToID(item.ID);
                              setReplyToOID(item.OID);
                              setReplyToName(item.name);
                              setRandom(Math.random());
                              window.location.href = '#nexment-comment-area';
                            }
                          }}
                        >
                          <div className="nexment-comments-avatar">
                            <img
                              src={
                                'https://gravatar.loli.net/avatar/' +
                                md5(item.email)
                              }
                            />
                            {adminBadge(item.name, item.email)}
                          </div>
                          <div className="nexment-comments-title">
                            <h5>
                              {item.name}
                              <span> · </span>
                              <b>{format(item.date)}</b>
                              {item.hasReplies ? (
                                <b className="nexment-comments-replyto">
                                  <span> · </span>
                                  {item.replyList.length}{' '}
                                  {item.replyList.length > 1
                                    ? 'replies'
                                    : 'reply'}
                                  {Icons().down}
                                </b>
                              ) : (
                                ''
                              )}
                              <em className="nexment-reply-icon">
                                {Icons().reply}
                              </em>
                            </h5>
                            <p className="nexment-comments-des">{item.tag}</p>
                            <div
                              className={
                                'nexment-comments-content ' +
                                (item.tag ? '' : 'margin-top')
                              }
                            >
                              <MarkdownView
                                markdown={item.content}
                                options={{ tables: true, emoji: true }}
                              />
                            </div>
                          </div>
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
                              duration={0}
                              showMask={false}
                            >
                              <RepliesList
                                key={item.OID}
                                dataContent={item.replyList}
                                replyTo={item.name}
                                pageKey={Props.pageKey}
                                replyToID={item.ID}
                                replyToOID={item.OID}
                                replyToName={item.name}
                                replyItem={item}
                                config={Props.config}
                              />
                            </Rodal>
                          ) : (
                            ''
                          )}
                        </div>
                      </li>
                    </div>
                  ))
                ) : (
                  <li>
                    <p>No Comments</p>
                  </li>
                )}
              </ul>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};
export default RepliesList;
