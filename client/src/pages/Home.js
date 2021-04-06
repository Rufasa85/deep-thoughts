import React, {useState} from 'react';
import { useQuery,useMutation } from '@apollo/react-hooks';
import { QUERY_THOUGHTS, QUERY_ME_BASIC } from '../utlis/queries';
import { ADD_THOUGHT} from '../utlis/mutations';
import ThoughtList from '../components/ThoughtList';
import Auth from '../utlis/auth';
import FriendList from '../components/FriendsList';
const loggedIn = Auth.loggedIn();
const Home = () => {
  // use useQuery hook to make query request
  const [newThought,setNewThought] = useState("")
  const { loading, data } = useQuery(QUERY_THOUGHTS);
  const { data: userData } = useQuery(QUERY_ME_BASIC);
  const [addThought,{err}]= useMutation(ADD_THOUGHT)
  const thoughts = data?.thoughts || [];
console.log(thoughts);

  const submitForm = event=>{
    event.preventDefault();
    addThought({
      variables:{
        text:newThought
      }
    })
  }
  return (
    <main>
      <div className='flex-row justify-space-between'>
      <div className={`col-12 mb-3 ${loggedIn && 'col-lg-8'}`}>
      <form onSubmit={submitForm}>
        <textarea value={newThought} onChange={(event)=>setNewThought(event.target.value)}></textarea>
        <button>Submit</button>
      </form>
  {loading ? (
    <div>Loading...</div>
  ) : (
    <ThoughtList thoughts={thoughts} title="Some Feed for Thought(s)..." />
  )}
</div>
{loggedIn && userData ? (
  <div className="col-12 col-lg-3 mb-3">
    <FriendList
      username={userData.me.username}
      friendCount={userData.me.friendCount}
      friends={userData.me.friends}
    />
  </div>
) : null}
      </div>
    </main>
  );
};

export default Home;
