export default {
  readBigquery: {
    service_id: 'SU1Z0isxPaozGVKXdv0eY',
    name: 'my_bigquery_logging',
    format: '{\n "timestamp":"%{begin:%Y-%m-%dT%H:%M:%S}t",\n  "time_elapsed":%{time.elapsed.usec}V,\n  "is_tls":%{if(req.is_ssl, "true", "false")}V,\n  "client_ip":"%{req.http.Fastly-Client-IP}V",\n  "geo_city":"%{client.geo.city}V",\n  "geo_country_code":"%{client.geo.country_code}V",\n  "request":"%{req.request}V",\n  "host":"%{req.http.Fastly-Orig-Host}V",\n  "url":"%{json.escape(req.url)}V",\n  "request_referer":"%{json.escape(req.http.Referer)}V",\n  "request_user_agent":"%{json.escape(req.http.User-Agent)}V",\n  "request_accept_language":"%{json.escape(req.http.Accept-Language)}V",\n  "request_accept_charset":"%{json.escape(req.http.Accept-Charset)}V",\n  "cache_status":"%{regsub(fastly_info.state, "^(HIT-(SYNTH)|(HITPASS|HIT|MISS|PASS|ERROR|PIPE)).*", "\\\\2\\\\3") }V"\n}',
    user: 'fastly-bigquery-log@example-fastly-log.iam.gserviceaccount.com',
    project_id: 'example-fastly-log',
    dataset: 'fastly_log_test',
    table: 'fastly_logs',
    template_suffix: null,
    secret_key: '-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC7bPG9yaIYd5AL\nmvOaYvNozFJB/VWS53KWBll769kJvlmgMks6r6Xrv8w6rjxWKjZeDrnXVf7UDa0F\nckPPIFvXRxahftWFMGArw0lIvQzgT4/BlndXU5RNxfah/8m7q/GIF6oNYWzfJwvv\nzodxDUqIRH2e2JWidNRjElHuogYHLhV4O/od5pAkfDwak/ihuuh/2VA3Auwb3nph\ndX2F0JBs14oPKZUTYUUSzUQY5IMxSxYUA4Q7W4v21x1EnJt+biXOrERk1rm4ieEE\nU3WkjR5c5gvG8xcWyYod87RNFELmIhCCytI1+t5C3Em/jPsQFtLzwHpbNhdW4oEm\nn7d06n75AgMBAAECggEAWRh26lNZfOwJS5sDRlbXgu/uAnSdI1JmxC6Mhz4cVGdq\nT57Y6DLrWuA4A4UkJYm3gorZiSXWF5PQthAVb/bf8bxXY7nZYpEWhnc09SD5aAAq\nREp0vMx8aWQ709K2YUJg+zDUo7u2d3YmVH8HH5TD43c7iDFJIIsNE3N4A0p+NxZ+\nw06FFW+fz/etrWiNyhrlTsbkMbSgU+GpFFBq1pCd0ni5d1YM1rsaAaUpmkwdjgjL\noDs+M/L/HtqfEhyZNdw8JF7EJXVE1bIl7/NL0rBInhyO28FcB56t/AG5nzXKFI/c\nc+IO7d6MOOqiGRLRWZItEpnyzuV8DZo461wy1hSvqQKBgQDhSsg2cHkTrtBW8x0A\n3BwB/ygdkkxm1OIvfioT+JBneRufUPvVIM2aPZBBGKEedDAmIGn/8f9XAHhKjs8B\nEsPRgE206s4+hnrTcK7AeWWPvM9FDkrkQCoJFuJrNy9mJt8gs7AnnoBa9u/J4naW\ne1tfC8fUfsa7kdzblDhcRQ8FhwKBgQDU+N4kPzIdUuJDadd6TkBbjUNPEfZzU5+t\nIike2VSRhApxAxviUnTDsTROwJRzKik9w7gIMka8Ek+nmLNMEtds77ttcGQRdu16\n+vT1iualiCJe+/iMbl+PiJtFwhEHECLU9QfgBVS6r2lDAlZA+w6nwCRiidlrObzO\nCXqVOzN3fwKBgAsrOuu//bClHP0ChnCReO38aU+1/gWnDiOOnKVq0DXhAiaOzD1P\nqAG6hZlEkFBDMPWzq62doKv+gPgpRkfmV0DenHuYnGrrHdG3p2IxYoCSuq/QupPA\nPpU+xjDMhpQI30zuu4/rQq+/yDl4+aoSKYB3xAtb0Zxg6dMU8QpZ/hmnAoGBAIFu\nIesbcQR7O8FGkMrmxZweNNrYCtQ57R/WU/FImWm6OnJGNmsMO6Q2jJiT12RKKjg8\nOxrYGz7vTfOIDOddyAiPhXPUSyyF/3uvCrIzUUsmeeUJ8xq9dVwQ5HS3pYuKVfDg\nXYHbG4w9UJaF1A+3xEdUsYglSLouo7z/67zH9tZXAoGBAKpsdjSd3R+llaAv2HQ8\nGMlN92UTr5i9w++QMXq4qspH5NEYqz3NHbKuYthZqxEsRUZbRP50eDWU4jvxFVJl\nLBFINp6B+3AsIme0YCyOaleB/Cy0347miSinSv2I6QiH6dQxHdHzrG+x1evS/76f\nKT0KS+ySjCAEWgg4v+mjUDUV\n-----END PRIVATE KEY-----\n',
    created_at: '2016-05-17T20:23:15+00:00',
    updated_at: '2016-05-17T20:23:15+00:00',
    deleted_at: null,
    response_condition: '',
  },
};
