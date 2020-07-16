import useComments from '../../lib/database/getCommentsList';
import React from 'react';

const CommentsList = (Props: { pageKey: string }) => {
  const { commentsData, isLoading, isError } = useComments(Props.pageKey);
  if (isLoading) {
    return <div>Loading....</div>;
  } else if (isError) {
    return <div>Error.</div>;
  } else {
    return (
      <div>
        <ul>
          {commentsData !== undefined && commentsData.length ? (
            commentsData.map(item => (
              <li key={item.ID}>
                <div>
                  <h5>{item.name}</h5>
                  <p>{item.content}</p>
                </div>
                <div>
                  <ul>
                    {item.replyList.map(replyItem => (
                      <li key={replyItem.ID}>
                        <div>
                          <h5>{replyItem.name}</h5>
                          <p>
                            @{item.name}: {replyItem.content}
                          </p>
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
