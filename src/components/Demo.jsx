import { useState, useEffect } from "react";
import { copy, linkIcon, loader, tick } from "../assets";

import {
  useLazyGetSummaryQuery,
  // useLazyExtractQuery,
  useSummarizeTextMutation,
} from "../services/article";

const Demo = () => {
  const [article, setArticle] = useState({
    url: "",
    summary: "",
  });

  const [allArticles, setAllArticles] = useState([]);

  const [copied, setCopied] = useState("");

  const [getSummary, { error, isFetching }] = useLazyGetSummaryQuery();

  // const [getExtract] = useLazyExtractQuery();

  const [summarizeText, { data: textSummary }] = useSummarizeTextMutation();

  const [paragraph, setParagraph] = useState("");
  const [summarizedParagraph, setSummarizedParagraph] = useState("");

  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [inputType, setInputType] = useState("url"); // "url" or "paragraph"

  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    const articlesFromLocalStorage = JSON.parse(
      localStorage.getItem("articles")
    );
    let userTextsFromLocalStorage = localStorage.getItem("userTexts");

    if (articlesFromLocalStorage) {
      setAllArticles(articlesFromLocalStorage);
    }

    if (userTextsFromLocalStorage) {
      try {
        userTextsFromLocalStorage = JSON.parse(userTextsFromLocalStorage);
      } catch (error) {
        console.error("Error parsing user texts from local storage:", error);
        userTextsFromLocalStorage = [];
      }
    } else {
      userTextsFromLocalStorage = [];
    }

    localStorage.setItem(
      "userTexts",
      JSON.stringify(userTextsFromLocalStorage)
    );

    console.log("Articles from local storage:", articlesFromLocalStorage);
    console.log("User texts from local storage:", userTextsFromLocalStorage);
  }, []);

  const handleTextSubmit = async (e) => {
    e.preventDefault();
    const { data, error } = await summarizeText({
      lang: "en",
      text: paragraph,
    });
    if (error) {
      console.error("Error:", error);
    }

    if (data) {
      const summarizedText = data.summary;
      setSummarizedParagraph(summarizedText);

      const userTextData = {
        originalParagraph: paragraph,
        summarizedParagraph: summarizedText,
      };

      const updatedUserTexts = [
        userTextData,
        ...JSON.parse(localStorage.getItem("userTexts")),
      ];
      localStorage.setItem("userTexts", JSON.stringify(updatedUserTexts));

      setInputType("paragraph");
      setShowResults(true);
    }
  };

  const handleParagraphChange = (e) => {
    setParagraph(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data } = await getSummary({ articleUrl: article.url });
    // const extractData = await getExtract({ articleUrl: article.url });

    if (data?.summary) {
      const newArticle = { ...article, summary: data.summary };
      const updatedArticles = [newArticle, ...allArticles];

      setArticle(newArticle);
      setAllArticles(updatedArticles);

      localStorage.setItem("articles", JSON.stringify(updatedArticles));

      setInputType("url");
      setShowResults(true);
    }
  };

  // const handleCopy = (copyUrl) => {
  //   setCopied(copyUrl);
  //   navigator.clipboard.writeText(copyUrl);
  //   setTimeout(() => setCopied(false), 3000);
  // };

  const handleEnterKeyPress = async (e) => {
    if (e.key === "Enter") {
      e.preventDefault();

      if (inputType === "url") {
        await handleSubmit(e);
      } else if (inputType === "paragraph") {
        await handleTextSubmit(e);
      }
    }
  };

  const handleCopy = (copyText) => {
    setCopied(copyText);
    navigator.clipboard.writeText(copyText);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleDelete = (deletedUrl) => {
    const updatedArticles = allArticles.filter(
      (item) => item.url !== deletedUrl
    );
    setAllArticles(updatedArticles);
    localStorage.setItem("articles", JSON.stringify(updatedArticles));
  };

  const toggleHistory = () => {
    if (inputType === "url") {
      setIsHistoryOpen((prevIsOpen) => !prevIsOpen);
    }
  };

  const historyPanelClass = {
    transition: "all 0.3s",
  };

  const historyPanelStyles = {
    visibility: isHistoryOpen ? "visible" : "hidden",
    opacity: isHistoryOpen ? 1 : 0,
    transform: `translateX(${isHistoryOpen ? "0" : "100%"})`,
    transition: "visibility 0s, opacity 0.3s ease, transform 0.3s ease",
  };

  return (
    <section className="w-full flex items-center justify-center min-h-screen">
      {/* Search */}
      <div className="flex flex-col w-full gap-2 rounded-[50px] p-7 dark:shadow-sm">
        <div className="flex flex-col items-center md:justify-center">
          {/* Render the URL and textarea input forms only if showResults is false */}
          {!showResults && (
            <form
              action=""
              className="relative mb-2 w-[300px] md:w-[650px] inline-flex items-center justify-center"
              onSubmit={handleSubmit}
            >
              <img
                src={linkIcon}
                alt="Link Icon"
                className="absolute left-0 my-2 ml-3 w-5"
              />
              <input
                type="url"
                placeholder="Please Enter your URL"
                value={article.url}
                onChange={(e) =>
                  setArticle({
                    ...article,
                    url: e.target.value,
                  })
                }
                required
                className="url_input peer"
                onKeyDown={handleEnterKeyPress}
              />

              <button
                type="submit"
                className="submit_btn peer-focus:border-gray-700 peer-focus:text-gray-700"
              >
                ↵
              </button>
            </form>
          )}

          {!showResults && <p className="my-5 text-center">- OR -</p>}

          {/* Render the URL and textarea input forms only if showResults is false */}
          {!showResults && (
            <form
              action=""
              className="mb-2 w-[300px] md:w-[650px] items-center justify-center flex flex-col"
              onSubmit={handleTextSubmit}
            >
              <textarea
                rows="15"
                placeholder="Enter the paragraph to summarize"
                value={paragraph}
                onChange={handleParagraphChange}
                required
                className="url_input-textarea resize-none"
                onKeyDown={handleEnterKeyPress}
              />

              <button
                type="submit"
                className="submit_btn-textarea md:mt-10 px-10 py-2 rounded-[30px] border-black/40 box-shadow-btn border font-bold flex items-center justify-center"
              >
                Submit
              </button>
            </form>
          )}
        </div>

        {showResults && (
          // Display results and history panel when showResults is true
          <div className="md:flex md:flex-row md:gap-5 transition-all rounded-[40px]">
            {/* Display Results  */}
            <div className="w-full flex justify-center items-center">
              {isFetching ? (
                <img
                  src={loader}
                  alt="Loader"
                  className="w-20 h-20 object-contain"
                />
              ) : error ? (
                <p className="font-inter font-bold text-black text-center">
                  {`We're currently experiencing technical turbulence. Please fasten your seatbelt! ✈️😄.`}{" "}
                  <br />
                  <span className="font-satoshi font-normal text-gray-700">
                    {error?.data?.error}
                  </span>
                </p>
              ) : (
                <div className="flex flex-col gap-3 bg-white/70 p-7 rounded-[40px]">
                  <div className="flex justify-between items-center border-b border-black pb-4">
                    <h2 className="font-satoshi font-bold text-gray-600 text-xl">
                      Article <span className="blue_gradient">Summary</span>
                    </h2>

                    <div className="flex items-center justify-center gap-2">
                      <div
                        className="copy_btn"
                        // onClick={() => handleCopy(article.summary)}
                        onClick={() =>
                          handleCopy(
                            inputType === "url"
                              ? article.summary
                              : summarizedParagraph
                          )
                        }
                        title="Copy Summary"
                      >
                        <img
                          src={
                            copied ===
                            (inputType === "url"
                              ? article.summary
                              : summarizedParagraph)
                              ? tick
                              : copy
                          }
                          alt="Copy Icon"
                          title="Copy Summary"
                          className="w-[60%] h-[60%] object-contain"
                        />
                      </div>

                      {inputType === "url" && (
                        <a
                          className="text-sm hover:underline transition-all cursor-pointer"
                          onClick={toggleHistory}
                        >
                          {isHistoryOpen ? "Hide History" : "Show History"}
                        </a>
                      )}
                    </div>
                  </div>

                  {inputType === "url" ? (
                    <div className="summary_box overflow-y-auto h-[480px] custom-scroll">
                      <p className="font-inter font-medium text-sm text-gray-700">
                        {article.summary}
                      </p>
                    </div>
                  ) : inputType === "paragraph" ? (
                    <div className="summary_box overflow-y-auto h-[480px] custom-scroll">
                      <p className="font-inter font-medium text-sm text-gray-700">
                        {summarizedParagraph}
                      </p>
                    </div>
                  ) : null}
                </div>
              )}
            </div>

            {
              /* History URL */
              isHistoryOpen && (
                <div
                  style={historyPanelStyles}
                  className="flex flex-col gap-1 overflow-y-auto custom-scroll mb-5 md:mb-0 md:h-[590px] md:w-[350px] bg-white/50 py-7 px-5 rounded-[40px]"
                >
                  <h2 className="font-satoshi font-bold text-gray-600 text-xl mb-2 border-b border-black pb-4">
                    Previous<span className="blue_gradient"> Links</span>
                  </h2>

                  {allArticles.map((item, index) => (
                    <div
                      key={`link-${index}`}
                      onClick={() => setArticle(item)}
                      className="link_card"
                    >
                      <div
                        className="copy_btn"
                        onClick={() => handleCopy(item.url)}
                      >
                        <img
                          src={copied === item.url ? tick : copy}
                          alt="Copy Icon"
                          className="w-[40%] h-[40%] object-contain"
                        />
                      </div>

                      <div
                        className="delete_btn"
                        onClick={() => handleDelete(item.url)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="rgba(239 68 68 1)"
                          x="0px"
                          y="0px"
                          width="15"
                          height="15"
                          viewBox="0 0 24 24"
                        >
                          <path d="M 10 2 L 9 3 L 5 3 L 4 3 L 4 5 L 5 5 L 5 20 C 5 21.093063 5.9069372 22 7 22 L 17 22 C 18.093063 22 19 21.093063 19 20 L 19 5 L 20 5 L 20 3 L 19 3 L 18 3 L 15 3 L 14 2 L 10 2 z M 7 5 L 17 5 L 17 20 L 7 20 L 7 5 z"></path>
                        </svg>
                      </div>
                      <p className="flex-1 font-satoshi text-blue-700 font-medium text-sm truncate ">
                        {item.url}
                      </p>
                    </div>
                  ))}
                </div>
              )
            }
          </div>
        )}
      </div>
    </section>
  );
};

export default Demo;
