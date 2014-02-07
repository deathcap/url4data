# url4data

Get a URL for the given data

Currently supports `blob:` URLs. Stores generated URLs by name in
`localStorage` for consistency across multiple invocations

Useful, for example, for [SharedWorker](http://www.w3.org/TR/workers)s
which require the same URL to access the same shared worker
across multiple browser tabs.

## License

MIT

