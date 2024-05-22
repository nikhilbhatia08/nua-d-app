import './App.css';
import TableViewer from 'react-js-table-with-csv-dl';
import { React, useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import axios from 'axios';

function App() {
  function shuffle(array) {
    let currentIndex = array.length;
  
    // While there remain elements to shuffle...
    while (currentIndex != 0) {
      // Pick a remaining element...
      let randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  }
  const [inp, setInp] = useState([{}]);
  const [author_name, setAuthorName] = useState("");
  const [bday, setbday] = useState("");
  const [top_work, set_top_work] = useState("");
  let get_string = 'https://openlibrary.org/authors/';
  const GetTop = async(str) => {
    axios.get('https://openlibrary.org/search/authors.json?q=' + str)
        .then((res) => {
          set_top_work(res.data.docs[1].top_work)
        })
        .catch((err) => {
          console.log(err)
        })
  }
  const getTheThing = async(id) => {
    await axios.get(get_string + id + '.json')
    .then((res) => {
      setAuthorName(res.data.name)
      setbday(res.data.birth_date)
      let timepass = author_name;
      //console.log(timepass)
      let str = "";
      for(let i = 0; i < timepass.length; i++) {
        if(timepass[i] !== ' ') {
          str += timepass[i];
        }
        else {
          str += '%20'
        }
      }
      //console.log(str)
      if(str.length !== 0)
        GetTop(str)
      return res.data;
    })
    .catch((err) => { 
      console.log(err)
    })
  }
  const getTheRating = async(query_name) => {
    await axios.get('https://openlibrary.org/search.json?title=' + query_name)
      .then((res)=>{
        console.log(res.data.docs[0].ratings_average)
        return res.data.docs[0].ratings_average;
      })
      .catch((err) => {
        console.log(err)
      })
  }
  const [new_array_of_data, set_new_arry_of_data] = useState([{}]);
  const [rr, setrr] = useState(0);
  let temp = [];
  const fetchData = async() => {  
    const hehe = ["OL23919A"];
    // "OL26320A",  "OL23919A" , "OL18319A"
    for(let i = 0; i < hehe.length; i++) {
      const res = await axios.get(`https://openlibrary.org/authors/${hehe[i]}/works.json`)
      .then((res) => {
        setInp(res.data.entries)
      })
      .then(() => {
        let gg = getTheThing(hehe[i])
        let rating = [];
        for(let i = 0; i < inp.length; i++) {
          // i have an object 
          let str = "";
          for(let j = 0; j < 10; j++) {
            str += inp[i].created.value[j];
          }
          let querying_name = "";
          for(let j = 0; j < inp[i].title.length; j++) {
            if(inp[i].title[j] !== ' ') {
              querying_name += inp[i].title[j];
            }
            else {
              querying_name += '+';
            }
          }
          let haha = 0;
          temp.push({
            name: author_name,
            title: inp[i].title,
            rating : (Math.random()*(4 - 0) + 1).toPrecision(2),
            first_published_at: str,
            birth_date: bday,
            top_work: "Mundo Mágico de Harry Potter"
          });
          // set_new_arry_of_data(temp);
        }
      })
      .catch((err) => {
        console.log(err)
      })
    }
  }
  const fun = () => {
    set_new_arry_of_data(temp);
  }
  useEffect(() => {
    alert('welcome')
    fetchData();
    fun();
    return;
  }, []);
  return (
    <>
      {new_array_of_data.length !== 0 ? <TableViewer
        title="DashBoard"
        content={new_array_of_data}
        headers={["name", "title", "rating", "first_published_at", "birth_date", "top_work"]}
        minHeight={0}
        maxHeight={400}

        pagination={10}
        activateDownloadButton={true}
        searchEnabled={true}
        placeHolderSearchText = "Search"
      /> : <>Loading..</>}
      <h1>
        {/* {inp} */}
      </h1>
    </>
  );
}

export default App;
