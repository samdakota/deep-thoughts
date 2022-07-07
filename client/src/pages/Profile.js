import React from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { Navigate, useParams } from 'react-router-dom';

import ThoughtList from '../components/ThoughtList';
import FriendList from '../components/FriendList';
import Auth from '../utils/auth';
import ThoughtForm from '../components/ThoughtForm';

import { QUERY_ME_BASIC } from '../utils/queries';
import { ADD_FRIEND } from '../utils/mutations';
import { useQuery } from '@apollo/client';
import { QUERY_USER } from '../utils/queries';

const Profile = () => {
  const { username: userParam } = UseParams();
  const { loading, data } = useQuery(userParam ? QUERY_USER : QUERY_ME, {
    variables: { username: userParam }
  });
  const user = data?.me || data?.user || {};
  const [addFriend] = useMutation(ADD_FRIEND);

  const handleClick = async () => {
    try {
      await addFriend({
        variables: { id: user._id }
      });
    } catch (err) {
      console.error(err);
    }
  };

  if (Auth.loggedIn() && Auth.getProfile().data.username === userParam) {
    return <Navigate to='/profile' />;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user?.username) {
    return (
      <h4>
        You need to be logged in to see this page. Use the nav links above to login or signup.
      </h4>
    )
  }

  return (
    <div>
      <div className="flex-row mb-3">
        <h2 className="bg-dark text-secondary p-3 display-inline-block">
          Viewing {userParam ? `${user.username}'s` : 'your'} profile.
        </h2>
        {userParam && (
          <button className='btn ml-auto' onClick={handleClick}>
            Add Friend
          </button>
        )}
      </div>

      <div className="flex-row justify-space-between mb-3">
        <div className="col-12 mb-3 col-lg-8">
          <ThoughtList thoughts={user.thoughts} title={`${user.username}'s thoughts ...`} />
        </div>

        <div className="col-12 col-lg-3 mb-3">
          <FriendList username={user.username} friendCount={user.friendCount} friends={user.friends} />
        </div>
      </div>
      <div className='mb-3'>{!userParam && <ThoughtForm />}</div>
    </div>
  );
};

export default Profile;
