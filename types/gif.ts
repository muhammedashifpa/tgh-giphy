export interface Gif {
  id: string;
  url: string;
  highResUrl: string;
  title: string;
  user: {
    name: string;
    avatar?: string;
  };
}

export interface GiphyUser {
  display_name?: string;
  username?: string;
  avatar_url?: string;
}

export interface GiphyGif {
  id: string;
  title: string;
  username: string;
  images: {
    fixed_width: {
      url: string;
    };
    original: {
      url: string;
    };
  };
  user?: GiphyUser;
}
