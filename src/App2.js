import './App.css';
import post from "./db.json"
import { LazyLoadImage } from "react-lazy-load-image-component";
import { useInfiniteQuery } from "@tanstack/react-query"
import { useIntersection } from "@mantine/hooks"
import { useRef, useEffect } from 'react';
import Box from "@mui/material/Box"
import CircularProgress from '@mui/material/CircularProgress';



const fetchData = async (page) => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return post.images.slice((page - 1) * 1, page * 1)
}
function App2() {
  const { data, fetchNextPage, isFetchingNextPage, hasNextPage } = useInfiniteQuery({
    queryKey: ['query'],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await fetchData(pageParam)
      return response
    },

    getNextPageParam: (_, pages) => {
      return pages.length+1;
    },
    initialData: {
      pages: [post.images.slice(0, 1)],
      pageParams: [1]
    }
  })
  
  const lastPostRef = useRef()
  const { ref, entry } = useIntersection({ root: null, threshold: 1 });
  useEffect(() => {
    if (entry?.isIntersecting && hasNextPage && !isFetchingNextPage) fetchNextPage()
  }, [entry, fetchNextPage, hasNextPage, isFetchingNextPage])
  const posts = data?.pages.flatMap((page) => page)
  return (
    <div className="App">
      <h1>Image Lazy Loader infinite Scrolling</h1>
      {posts?.map((page, i) => (
        <div key={page.id} ref={i === posts.length - 1 ? ref : null}>

          <LazyLoadImage
            key={page.id}
            effect="blur"
            src={page.url}
          />
        </div>
      ))}
      <div ref={lastPostRef} style={{ height: '20px' }}>
        {isFetchingNextPage && posts.length < post.images.length && <Box sx={{ display: 'flex', justifyContent: "center" }}>
          <CircularProgress />
        </Box>}</div>
    </div>
  );
}

export default App2;
