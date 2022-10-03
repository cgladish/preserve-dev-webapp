import type { NextApiRequest, NextApiResponse } from "next";
import axios, { AxiosError } from "axios";
import { omit } from "lodash";
import { getToken } from "next-auth/jwt";
import crypto from "crypto";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const token = await getToken({ req, raw: true });
  try {
    const a = await axios({
      url: `${process.env.API_URL}/${((req.query.slug ?? []) as string[]).join(
        "/"
      )}`,
      method: req.method,
      headers: {
        authorization: token ? `Bearer ${token}` : undefined,
        "Content-Type": "application/json",
      },
      params: omit(req.query, "slug"),
      data: req.body ? JSON.parse(req.body) : undefined,
    });
    res.status(a.status).send(JSON.stringify(a.data));
  } catch (err) {
    const error = err as AxiosError;
    res
      .status(error.response?.status ?? 500)
      .send(error.response?.statusText ?? "Server error");
  }
}
