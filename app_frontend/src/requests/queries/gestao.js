import axios from '../axios';

const queries = {
  'gestao-torneio': async ({ queryKey }) => {
    const { data } = await axios.get(`/torneios/${queryKey[1]}`);
    return data;
  },
  'get-inscricoes': async ({ queryKey }) => {
    const { data } = await axios.get(`/torneios/${queryKey[1]}/inscricoes`);
    return data;
  }
};

export default queries;
