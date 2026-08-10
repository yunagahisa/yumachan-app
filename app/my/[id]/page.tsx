"use client";

import { useParams } from "next/navigation";
import MyYumaPageContent from "@/app/components/MyYumaPageContent";

export default function MyYumaPage(){

  const params = useParams();

  const yumaId = params.id as string;

  return(

    <MyYumaPageContent

      yumaId={yumaId}

    />

  );

}