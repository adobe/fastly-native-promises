export default {
  edgeCheck: [
    {
      hash: 'c6447943be2cff04787d9367ddd58fa0',
      request: {
        headers: {
          Host: 'www.example.com/foo/bar',
          'User-Agent': 'Fastly/cache-check',
        },
        method: null,
        url: null,
      },
      response: {
        headers: {
          'Accept-Ranges': 'bytes',
          Age: '0',
          Connection: 'keep-alive',
          'Content-Length': '154189',
          'Content-Type': 'text/html; charset=UTF-8',
          Date: 'Mon, 06 Jun 2016 15:26:05 GMT',
          ETag: 'W/\'76cdf069e25c5e32bb8005982d3f8e0d\'',
          Expires: 'Thu, 01 Jan 1970 00:00:00 GMT',
          'Set-Cookie': [
            'crumb=EUmnHJvt3XCJP2hZmlzWCvVNzOHq5Wb1;Path=/',
            'SS_MID=7b22de59-a0ca-4d2f-aea2-dbe337990ba3ip466npy;Path=/;Domain=.example.com;Expires=Thu, 04-Jun-2026 15:26:05 GMT',
          ],
          Vary: 'Accept-Encoding, User-Agent',
          Via: '1.1 varnish',
          'X-Cache': 'MISS',
          'X-Cache-Hits': '0',
          'X-ContextId': 'P0IlaNKm/roP4a7jq',
          'X-PC-AppVer': '7951',
          'X-PC-Date': 'Mon, 06 Jun 2016 15:26:04 GMT',
          'X-PC-Hit': 'true',
          'X-PC-Host': '127.0.0.1',
          'X-PC-Key': 'OZs6DMRDuX2Tj7xXJlbWIZgI2cI-example',
          'X-Served-By': 'cache-sjc3120-SJC',
          'X-ServedBy': 'web029',
          'X-Timer': 'S1465226764.194256,VS0,VE1054',
          'X-Via': '1.1 echo007',
        },
        status: 200,
      },
      response_time: 2.604431,
      server: 'cache-sjc3120',
    },
  ],
};
