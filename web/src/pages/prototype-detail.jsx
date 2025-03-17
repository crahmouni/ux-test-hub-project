import { useParams, Link } from "react-router-dom";
import { PageLayout } from "../components/layouts";
import { PrototypeDetail } from "../components/prototypes";

function PrototypeDetailPage() {
  const { id } = useParams();

  return (
    <PageLayout>
      <PrototypeDetail id={id} />
      <Link to="/prototypes" className="btn btn-primary mt-3">
        Back to List
      </Link>
    </PageLayout>
  );
}

export default PrototypeDetailPage;