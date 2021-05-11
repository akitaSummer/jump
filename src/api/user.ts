import Taro from "@tarojs/taro";
import { UserInfoEditType } from "../store";

const userUrl = "https://doudou0.online/bg";

export const login = async (code: string) =>
  await Taro.request({
    url: `${userUrl}/login`,
    data: {
      code
    },
    method: "POST"
  });

export const getUserInfo = async (access_token: string) =>
  await Taro.request({
    url: `${userUrl}/users?access_token=${access_token}`,
    method: "GET"
  });

export const updateUser = async (
  access_token: string,
  data: UserInfoEditType
) =>
  await Taro.request({
    header: {
      AccessToken: access_token
    },
    url: `${userUrl}/users`,
    data: {
      ...data
    },
    method: "PUT"
  });

export const uploadFile = async (access_token: string, name: string, path) => {
  await Taro.uploadFile({
    url: `${userUrl}/files`,
    filePath: path,
    name: "file",
    header: {
      AccessToken: access_token
    },
    formData: {
      fileName: name
    }
  });
};

export const getResumesList = async (access_token: string) =>
  await Taro.request({
    url: `${userUrl}/resumes`,
    method: "GET",
    header: {
      AccessToken: access_token
    }
  });

export const delResumes = async (access_token: string, id: number) =>
  await Taro.request({
    url: `${userUrl}/resumes/${id}`,
    method: "DELETE",
    header: {
      AccessToken: access_token
    }
  });

export const downloadResumes = async (access_token: string, path, name) =>
  await Taro.downloadFile({
    url: `${userUrl}/files?path=${path}&filename=${name}`,
    header: {
      AccessToken: access_token
    }
  });