import {useReducer} from 'react';
import {boolean} from 'yup';
import useFetch from '../useFetch';

type ReaducerType =
  | 'LOADING'
  | 'SUCCESS'
  | 'FAIL'
  | 'TOP_MESSAGE'
  | 'UN_TOP_MESSAGE'
  | 'READMESSAGE'
  | 'RESTORE_MESSAGE';

const useMessage = () => {
  const [state, dispatch] = useReducer(
    (
      prevState: {
        isLoading: boolean;
        error: any;
        messages: Array<any>;
        topMessages: Array<any>;
      },
      action: {
        type: ReaducerType;
        isLoading?: boolean;
        error?: any;
        messages?: any;
        topMessages?: any;
      },
    ) => {
      switch (action.type) {
        case 'LOADING':
          return {
            ...prevState,
            isLoading: true,
          };
        case 'SUCCESS':
          return {
            ...prevState,
            isLoading: false,
            messages: action.messages,
            topMessages: action.topMessages,
          };
        case 'READMESSAGE':
          return {
            ...prevState,
            isLoading: false,
            messages: action.messages,
            topMessage: action.topMessages,
          };
        case 'TOP_MESSAGE':
          return {
            ...prevState,
            isLoading: false,
            topMessage: action.topMessages,
          };
        case 'UN_TOP_MESSAGE':
          return {
            ...prevState,
            isLoading: false,
            messages: action.messages,
            topMessage: action.topMessages,
          };
        case 'RESTORE_MESSAGE':
          return {
            ...prevState,
            isLoading: false,
            messages: action.messages,
            topMessage: action.topMessages,
          };
        default:
          return prevState;
      }
    },
    {
      isLoading: true,
      error: undefined,
      messages: [],
      topMessages: [],
    },
  );
  const {fetchData} = useFetch();

  const getMessagesHandler = async (needLoading?: boolean) => {
    try {
      needLoading && dispatch({type: 'LOADING'});
      const res = await fetchData(
        '/msg/QueryMessageList/magicApiJSON.do',
        'POST',
      );
      dispatch({
        type: 'SUCCESS',
        messages: res?.info
          ?.filter(item => item.isTop === 0)
          .sort(
            (a, b) =>
              new Date(b.creatTime.replace(/-/g, '/')).valueOf() -
              new Date(a.creatTime.replace(/-/g, '/')).valueOf(),
          ),
        topMessages: res?.info
          ?.filter(item => item.isTop === 1)
          .sort(
            (a, b) =>
              new Date(b.updateTime.replace(/-/g, '/')).valueOf() -
              new Date(a.updateTime.replace(/-/g, '/')).valueOf(),
          ),
      });
    } catch (error: any) {
      dispatch({type: 'FAIL', error: error});
    }
  };

  const readMessageHandler = async (id: number, isTop: number) => {
    try {
      await fetchData('/msg/ChangeMessageStatus/magicApiJSON.do', 'POST', {
        Id: id,
        OpeType: 1,
      });
      await getMessagesHandler();
    } catch (error: any) {
      dispatch({type: 'FAIL', error});
    }
  };

  const deleteMessageHandler = async (id: number) => {
    try {
      fetchData('/msg/ChangeMessageStatus/magicApiJSON.do', 'POST', {
        Id: id,
        OpeType: 2,
      });
      await getMessagesHandler();
    } catch (error: any) {
      dispatch({type: 'FAIL', error});
    }
  };
  const topMessageHandler = async (id: number) => {
    try {
      await fetchData('/msg/ChangeMessageStatus/magicApiJSON.do', 'POST', {
        Id: id,
        OpeType: 3,
      });
      await getMessagesHandler();
    } catch (error: any) {
      dispatch({type: 'FAIL', error});
    }
  };
  const unTopMessageHandler = async (id: number) => {
    try {
      await fetchData('/msg/ChangeMessageStatus/magicApiJSON.do', 'POST', {
        Id: id,
        OpeType: 4,
      });
      await getMessagesHandler();
    } catch (error: any) {
      dispatch({type: 'FAIL', error});
    }
  };

  const restoreMessageHandler = async () => {};

  return {
    ...state,
    getMessagesHandler,
    readMessageHandler,
    deleteMessageHandler,
    topMessageHandler,
    unTopMessageHandler,
    restoreMessageHandler,
  };
};

export default useMessage;
