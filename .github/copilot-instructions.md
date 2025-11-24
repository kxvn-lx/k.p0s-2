strictly no genereating summary markdown or any markdowns whatsoever unless explicitly stated by the user - instead just summarize it on the chat itself.

no need to run dev server, run build, simply do npx tsc --noEmit to test any ts error.

follow strictly all instructions under .github/instructions.

UI is from react-native-reusables and nativewind.
https://reactnativereusables.com/docs

global state uses zustand: https://github.com/pmndrs/zustand
querying uses tanstack/query: https://github.com/tanstack/query
