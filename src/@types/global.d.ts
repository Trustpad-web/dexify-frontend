type User = {
  id: string;
  address: string;
  email: string;
  title: string;
  bio: string;
  name: string;
  image: string;
  twitterName: string;
  twitterScreenName: string;
  twitterImage: string;
};

type AccountState = {
  user: User;
  loading: boolean;
};
