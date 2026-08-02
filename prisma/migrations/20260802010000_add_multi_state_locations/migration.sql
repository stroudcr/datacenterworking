ALTER TABLE "Job"
ADD COLUMN "locationStates" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
ADD COLUMN "isRemote" BOOLEAN NOT NULL DEFAULT false;

WITH state_lookup(code, name) AS (
  VALUES
    ('AL', 'Alabama'), ('AK', 'Alaska'), ('AZ', 'Arizona'), ('AR', 'Arkansas'),
    ('CA', 'California'), ('CO', 'Colorado'), ('CT', 'Connecticut'), ('DE', 'Delaware'),
    ('FL', 'Florida'), ('GA', 'Georgia'), ('HI', 'Hawaii'), ('ID', 'Idaho'),
    ('IL', 'Illinois'), ('IN', 'Indiana'), ('IA', 'Iowa'), ('KS', 'Kansas'),
    ('KY', 'Kentucky'), ('LA', 'Louisiana'), ('ME', 'Maine'), ('MD', 'Maryland'),
    ('MA', 'Massachusetts'), ('MI', 'Michigan'), ('MN', 'Minnesota'), ('MS', 'Mississippi'),
    ('MO', 'Missouri'), ('MT', 'Montana'), ('NE', 'Nebraska'), ('NV', 'Nevada'),
    ('NH', 'New Hampshire'), ('NJ', 'New Jersey'), ('NM', 'New Mexico'), ('NY', 'New York'),
    ('NC', 'North Carolina'), ('ND', 'North Dakota'), ('OH', 'Ohio'), ('OK', 'Oklahoma'),
    ('OR', 'Oregon'), ('PA', 'Pennsylvania'), ('RI', 'Rhode Island'), ('SC', 'South Carolina'),
    ('SD', 'South Dakota'), ('TN', 'Tennessee'), ('TX', 'Texas'), ('UT', 'Utah'),
    ('VT', 'Vermont'), ('VA', 'Virginia'), ('WA', 'Washington'), ('WV', 'West Virginia'),
    ('WI', 'Wisconsin'), ('WY', 'Wyoming'), ('DC', 'District of Columbia')
)
UPDATE "Job" AS job
SET "locationStates" = COALESCE(
  (
    SELECT array_agg(state_lookup.code ORDER BY state_lookup.code)
    FROM state_lookup
    WHERE job.state = state_lookup.code
      OR job.location ~ ('(^|[^A-Za-z])' || state_lookup.code || '([^A-Za-z]|$)')
      OR lower(job.location) ~ (
        '(^|[,/|;][[:space:]]*)'
        || lower(state_lookup.name)
        || '([[:space:]]*($|[/|;]))'
      )
  ),
  ARRAY[]::TEXT[]
);

UPDATE "Job"
SET "isRemote" = lower(location) ~ '(^|[^a-z])(remote|work from home|wfh|anywhere|distributed|virtual|telecommute)([^a-z]|$)';

CREATE INDEX "Job_isRemote_idx" ON "Job"("isRemote");
CREATE INDEX "Job_locationStates_idx" ON "Job" USING GIN ("locationStates");
