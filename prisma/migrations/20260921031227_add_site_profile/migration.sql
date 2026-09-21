-- CreateTable
CREATE TABLE "SiteProfile" (
    "id" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "headline" TEXT NOT NULL,
    "shortBio" TEXT NOT NULL,
    "longBio" TEXT,
    "location" TEXT,
    "avatarMediaId" TEXT,
    "emailPublic" TEXT,
    "whatsappNumber" TEXT,
    "githubUrl" TEXT,
    "linkedinUrl" TEXT,
    "instagramUrl" TEXT,
    "cvUrl" TEXT,
    "heroCtaPrimaryLabel" TEXT,
    "heroCtaPrimaryHref" TEXT,
    "heroCtaSecondaryLabel" TEXT,
    "heroCtaSecondaryHref" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SiteProfile_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SiteProfile" ADD CONSTRAINT "SiteProfile_avatarMediaId_fkey" FOREIGN KEY ("avatarMediaId") REFERENCES "Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;
