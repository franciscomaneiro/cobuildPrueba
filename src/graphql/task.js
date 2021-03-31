import { gql } from '8base-react-sdk';

// Querys
export const GET_TASK = gql`
  query GetTask {
    tasksList {
      items {
        content
        id
        state
        userAsigned {
          email
          firstName
        }
      }
    }
  }
`;


//Mutations 
export const CREATE_TASK = gql`
  mutation TaskCreate($data: TaskCreateInput!) {
    taskCreate(data: $data) {
      id
    }
  }
`;

export const EDIT_TASK = gql`
  mutation editTask($data: TaskUpdateInput!, $filter: TaskKeyFilter) {
    taskUpdate(data: $data, filter: $filter) {
      id
    }
  }
`;

export const DEL_TASK = gql`
  mutation DeleteTask($filter: TaskFilter!) {
    taskDeleteByFilter(filter: $filter) {
      success
    }
  }
`;

export const CHANGE_STATE = gql`
  mutation stateChanger($id: ID) {
    changeState(id: $id) {
      success
    }
  }
`
