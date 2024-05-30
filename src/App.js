import './App.css';
import post from "./db.json"
import { LazyLoadImage } from "react-lazy-load-image-component";
import { useInfiniteQuery } from "@tanstack/react-query"
const fetchData = async (page) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return post.images.slice((page - 1) * 1, page * 1)
}
// console.log(post.images,fetchData,"test")
function App() {
  const { data, fetchNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey:['query'],
    queryFn:async ({ pageParam =1 }) => {
      const response = await fetchData(pageParam)
      return response
  }, 
    
    getNextPageParam: (_, pages) => {
      return pages.length + 1
    },
    initialData: {
      pages: [post.images.slice(0, 1)],
      pageParams: [1]
    }
})
  console.log(data)
  return (
    <div className="App">
      <h1>Image Lazy Loader</h1>
      {data?.pages.map((page,i)=>(
      <div key={i}>
      {page?.map((image) => (
        <LazyLoadImage
          key={image.id}
          effect="blur"
          src={image.url}
        />
      ))}
      </div>
      ))}
      <button onClick={()=>fetchNextPage()} disabled={isFetchingNextPage}>{isFetchingNextPage ? "Loading More...":(data?.pages.length ?? 0 ) < 12 ? "Load More" : "You Are All Set"}</button>

    </div>
  );
}

export default App;
