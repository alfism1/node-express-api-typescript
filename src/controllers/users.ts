import express from "express";

import {
  deleteUserById,
  getUserByEmail,
  getUserById,
  getUsers,
} from "../db/users";

export const getAllUsers = async (
  _req: express.Request,
  res: express.Response
) => {
  try {
    const users = await getUsers();

    return res.status(200).json(users);
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
};

export const deleteUser = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params;
    const user = await deleteUserById(id);
    return res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
};

export const updateUser = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params;

    const user = await getUserById(id);

    if (req.body.email && req.body.email !== user.email) {
      const existingUser = await getUserByEmail(req.body.email);

      if (existingUser) {
        return res.sendStatus(409);
      }
    }

    req.body.username && (user.username = req.body.username);
    req.body.email && (user.email = req.body.email);
    req.body.password && (user.authentication.password = req.body.password);

    await user.save();

    return res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
};
