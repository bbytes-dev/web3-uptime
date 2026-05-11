import express from "express";
import { authMiddleware } from "./middleware";
import { prismaClient } from "db/client";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/api/v1/website", authMiddleware, async (req, res) => {
  const userId = req.userId!;
  const { url } = req.body;

  const data = await prismaClient.website.create({
    data: {
      userId,
      url
    },
  });

  res.json({
    id: data.id,
    message: "Website added successfully"
  })

});

app.get("/api/v1/websites/status", authMiddleware, async (req, res) => {
  const websiteId = req.query.websiteId;
  const userId = req.userId!;
  const data = await prismaClient.website.findFirst({
    where: {
      id: websiteId as string,
      userId,
      disabled:false
    },include :{
      ticks: true
    }
  })

  res.json(data)

});

app.get("/api/v1/websites", authMiddleware, async(req, res) => {
  const userId = req.userId!;
  const data = await prismaClient.website.findMany({
    where: {
      userId,
      disabled:false
    }
  })
  res.json(data)
});


app.delete("/api/v1/website", authMiddleware, async (req, res) => {
  const userId = req.userId!;
const websiteId = req.query.websiteId as string;
  const data = await prismaClient.website.update({
    where: {
      userId,
      id: websiteId
    },
    data: {
      disabled: true
    }
  })
  res.json({message: "Website deleted successfully"})
});

app.get("/health", (req, res) => {
  res.send("OK");
});

app.listen(8080, () => {
  console.log("Server started on port 8080");
});