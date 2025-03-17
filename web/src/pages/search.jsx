import { useLocation, useSearchParams } from "react-router-dom";
import { PrototypeList } from "../components/prototypes";
import { PageLayout } from "../components/layouts";
import { Button } from "react-bootstrap";

function SearchPage() {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParams = new URLSearchParams(location.search);
  const city = queryParams.get('city');
  const max = queryParams.get('max');
  const page = queryParams.get('page') || 1;
  const lat = queryParams.get('lat');
  const lng = queryParams.get('lng');

  function handlePageChange(newPage) {
    newPage = Math.max(1, newPage);
    setSearchParams({ city, max, page: newPage, lat, lng });
  }

  return (
    <PageLayout>
      <h3 className="fw-light">What's on in {city}</h3>
      <PrototypeList city={city} max={max} page={page} lat={lat} lng={lng} />
      <div className="mt-3">
        <Button variant="secondary" onClick={() => handlePageChange(Number(page) - 1)} disabled={page <= 1}>
          Previous
        </Button>
        <span className="mx-3">Page {page}</span>
        <Button variant="primary" onClick={() => handlePageChange(Number(page) + 1)}>
          Next
        </Button>
      </div>
    </PageLayout>
  );
}

export default SearchPage;