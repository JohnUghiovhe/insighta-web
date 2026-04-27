import Link from "next/link";
import { formatAge, formatDateTime, formatPercent } from "@/lib/format";
import { Profile } from "@/lib/types";

type ProfileCardProps = {
  profile: Profile;
  compact?: boolean;
};

export function ProfileCard({ profile, compact }: ProfileCardProps) {
  return (
    <Link className={`profile-card${compact ? " compact" : ""}`} href={`/profiles/${profile.id}`}>
      <div className="profile-card-top">
        <div>
          <p className="profile-name">{profile.name}</p>
          <p className="profile-meta">
            {profile.country_name} · {profile.gender}
          </p>
        </div>
        <span className="pill">{profile.age_group}</span>
      </div>

      <div className="profile-grid-mini">
        <div>
          <span>Age</span>
          <strong>{formatAge(profile.age)}</strong>
        </div>
        <div>
          <span>Gender confidence</span>
          <strong>{formatPercent(profile.gender_probability)}</strong>
        </div>
        <div>
          <span>Country confidence</span>
          <strong>{formatPercent(profile.country_probability)}</strong>
        </div>
      </div>

      {!compact ? <p className="profile-timestamp">Created {formatDateTime(profile.created_at)}</p> : null}
    </Link>
  );
}