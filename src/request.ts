import queryString from "querystring";

type Options = {
  url: string;
  formatter: "json-swagger";
}

// 请求方法封装
const proxyServerPath =
  "https://service-cb48tc9u-1257965015.gz.apigw.tencentcs.com/release/proxy";
export default function request({ options }: { options: Options }) {
  return fetch(proxyServerPath + '?' + queryString.stringify(options)).then((res) =>
    res.json()
  );
}
