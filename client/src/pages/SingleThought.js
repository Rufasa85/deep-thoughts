import React,{useState} from 'react';
import ReactionList from "../components/ReactionList"
import { useParams } from 'react-router-dom';
import { useQuery,useMutation } from "@apollo/react-hooks";
import { QUERY_THOUGHT } from "../utlis/queries";
import { ADD_REACTION } from "../utlis/mutations";




const SingleThought = props => {
  const { id: thoughtId } = useParams();
  const [formState,setFormState] = useState("")
  const { loading, data } = useQuery(QUERY_THOUGHT, {
    variables: { id: thoughtId }
  });
  const [addReaction, { error }] = useMutation(ADD_REACTION);


  const thought = data?.thought || {};
  if (loading) {
    return <div>loading...</div>
  }
  const thoughtAdd= event=>{
    event.preventDefault();
    addReaction({
      variables:{
        body: formState,
        id: thoughtId
      }
    })
    
  }
  return (
    <div>
      <div className="card mb-3">
        <p className="card-header">
          <span style={{ fontWeight: 700 }} className="text-light">
            {thought.username}
          </span>{' '}
          thought on {thought.createdAt}
        </p>
        <div className="card-body">
          <p>{thought.thoughtText}</p>
        </div>
      </div>
      {thought.reactionCount >0 && <ReactionList reactions={thought.reactions}/>}
      <form onSubmit={thoughtAdd}>
        <textarea value={formState} onChange={(event)=>setFormState(event.target.value)}>Add A Reaction....</textarea>
        <button>Submit</button>
      </form>
    </div>
  );
};

export default SingleThought;
