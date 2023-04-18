import { backendInstance } from "./axios";

export const getUser = (address: string): Promise<User> =>
  new Promise(async (resolve, reject) => {
    try {
      const res = await backendInstance.get(`/user`, {
        params: {
          address,
        },
      });
      if (!res.data.id) {
        return reject("no user");
      }
      const fields: string[] = ["bio", "email", "name", "image", "title"];
      fields.forEach((element) => {
        if (res.data[element] === null) {
          res.data[element] = "";
        }
      });
      res.data.address = address;
      const user: Record<string, string> = {
        id: "",
        address: "",
        email: "",
        title: "",
        bio: "",
        name: "",
        image: "",
        twitterName: "",
        twitterScreenName: "",
        twitterImage: "",
      };

      Object.keys(user).map((key) => {
        if (res.data[key]) {
          user[key] = res.data[key];
        }
      });
      resolve(user as User);
    } catch (error) {
      reject(error);
    }
  });

export const postUser = (
  signature: string,
  address: string,
  file: File | undefined,
  newAccount: User
): Promise<User> =>
  new Promise(async (resolve, reject) => {
    try {
      const data = new FormData();
      data.append("address", address);
      data.append("signature", signature);
      data.append("email", newAccount.email);
      data.append("bio", newAccount.bio);
      data.append("name", newAccount.name);
      data.append("title", newAccount.title);
      if (file) {
        data.append("file", file);
      }

      const res = await backendInstance.post(`/user`, data);
      resolve(res.data as User);
    } catch (error) {
      reject(error);
    }
  });
