import { Searcher } from "fast-fuzzy"; // https://www.npmjs.com/package/fast-fuzzy

const options = ["def", "bcd", "cde", "abc"];

export const example = () => {
	const searcher = new Searcher(options);
	searcher.search("abc"); //returns ["abc", "bcd"]

	//options are passed in on construction
	const anotherSearcher = new Searcher(
		[{ name: "thing1" }, { name: "thing2" }],
		{ keySelector: (obj) => obj.name },
	);

	//some options can be overridden per call
	searcher.search("abc", { returnMatchData: true });
	/* returns [{
      item: 'abc', original: 'abc', key: 'abc', score: 1,
      match: {index: 0, length: 3},
  }, { 
      item: 'bcd', original: 'bcd', key: 'bcd', score: 0.6666666666666667,
      match: {index: 0, length: 2},
  }] */
};

const useReact = (options: unknown[]) => {
	const searcher = useMemo(() => new Searcher(options), []);
};
