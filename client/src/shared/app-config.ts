function getApiBaseUrl(): string {
  let uri: string = "https://invo-sys.onrender.com/";
  if (document.location.origin === "http://localhost:4200") {
    uri = "http://localhost:4000/";
  }
  return uri;
}

export const API_BASE_URL = getApiBaseUrl();
