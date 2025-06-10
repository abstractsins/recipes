'use client';

import { useEffect, useState } from "react";

import Tags from "./Tags";
import CloseButton from "./CloseButton";

import { Tag, AdminModule } from "@/types/types";

export default function TagsModule({ className, onClick: activate, active, close }: AdminModule) {

    const [isLoading, setIsLoading] = useState(true);
    const [tags, setTags] = useState<Tag[]>([]);


    //* ------------------------------------------
    //* 👥 FETCH TAGS
    //* ------------------------------------------
    useEffect(() => {
        async function fetchTags() {
            try {
                const res = await fetch('/api/tag');
                const data: Tag[] = await res.json();
                setTags(data);
            } catch (err) {
                console.error("Failed to fetch tags:", err);
            } finally {
                setIsLoading(false);
            }
        }

        fetchTags();
    }, []);

    return (
        <div className={`module ${className}`} id="tags-module" onClick={activate}>
            <div className="module-header">
                <h2>Tags</h2>
                <span className="cat-data-label">total:</span><span className="cat-data"> {isLoading ? '--' : tags.length}</span>
            </div>
            {active &&
                (<>
                    <div className="module-body">
                        {
                            isLoading
                                ? <div className="tags-skeleton"></div>
                                : <Tags data={tags} />
                        }
                    </div>

                    <CloseButton onClick={close} />
                </>
                )}
        </div>
    );
}