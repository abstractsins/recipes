'use client';

import { useEffect, useState } from "react";

import RecipeTags from "@/components/admin/dashboard/readouts/RecipeTags";
import CloseButton from "@/components/admin/dashboard/CloseButton";

import { Tag, AdminModule } from "@/types/types";

export default function RecipeTagsModule({ className, onClick: activate, active, close }: AdminModule) {

    const [isLoading, setIsLoading] = useState(true);
    const [tags, setTags] = useState<Tag[]>([]);


    //* ------------------------------------------
    //* 👥 FETCH TAGS
    //* ------------------------------------------
    useEffect(() => {
        async function fetchTags() {
            try {
                const res = await fetch('/api/tag/recipe');
                const data: Tag[] = await res.json();
                setTags(data);
                console.log(data);
            } catch (err) {
                console.error("Failed to fetch tags:", err);
            } finally {
                setIsLoading(false);
            }
        }

        fetchTags();
    }, []);

    return (
        <div className={`module ${className}`} id="recipe-tags-module" onClick={activate}>
            <div className="module-header">
                <h3>Recipe Tags</h3>
                <span className="cat-data-label">total:</span><span className="cat-data"> {isLoading ? '--' : tags.length}</span>
            </div>
            {active &&
                (<>
                    <div className="module-body">
                        {
                            isLoading
                                ? <div className="tags-skeleton"></div>
                                : <RecipeTags data={tags} />
                        }
                    </div>

                    <CloseButton onClick={close} />
                </>
                )}
        </div>
    );
}