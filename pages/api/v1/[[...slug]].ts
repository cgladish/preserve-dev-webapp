import type { NextApiRequest, NextApiResponse } from "next";
import axios, { AxiosError } from "axios";
import { omit } from "lodash";
import { getAccessToken } from "@auth0/nextjs-auth0";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let accessToken: string | undefined;
  try {
    const tokenResult = await getAccessToken(req, res);
    accessToken = tokenResult.accessToken;
  } catch (err) {}
  try {
    const a = await axios({
      url: `${process.env.API_URL}/${((req.query.slug ?? []) as string[]).join(
        "/"
      )}`,
      method: req.method,
      headers: {
        "Content-Type": "application/json",
        ...(accessToken ? { authorization: `Bearer ${accessToken} ` } : {}),
      },
      params: omit(req.query, "slug"),
      data: req.body ? JSON.parse(req.body) : undefined,
    });
    if (
      req.method === "POST" &&
      a.status === 200 &&
      req.query.slug?.[0] === "snippets"
    ) {
      const snippetId = req.query.slug?.[1];
      const subRoute = req.query.slug?.[2];
      if (snippetId && (!subRoute || subRoute === "claim")) {
        await res.revalidate(`/p/${snippetId}`);
      }
    }
    res.status(a.status).send(JSON.stringify(a.data));
  } catch (err) {
    const error = err as AxiosError;
    res
      .status(error.response?.status ?? 500)
      .send(error.response?.statusText ?? "Server error");
  }
}
