'use client';

export default function Course({ params }: { params: { id: string } }) {
    return <p>ID: {params.id}</p>;
}
